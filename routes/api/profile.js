const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  GET api/profile/me
// @desc   get current users profile
// @access Private
router.get('/me', auth, async function(req, res){
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',['name','avatar']);
        if(!profile){
            res.status(400).json({ msg: 'Profile not found.' });
        }
        res.json(profile);

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); 

// @route  POST api/profile
// @desc   Create or update user profile
// @access Private

router.post('/',[ auth, 
    [
        check('status', 'Status is required').notEmpty(), 
        check('skills', 'Skills is required').notEmpty() 
    ]
], 
async (req, res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;

      //build profile object
      const profileFields = {};
      profileFields.user = req.user.id;
      if(company) profileFields.company = company;
      if(website) profileFields.website = website;
      if(location) profileFields.location = location;
      if(bio) profileFields.bio = bio;
      if(status) profileFields.status = status;
      if(githubusername) profileFields.githubusername = githubusername;
      if(skills){
          profileFields.skills = skills.split(',').map(skill => skill.trim());
      }
      
      //build social objects
      profileFields.social = {}
      if(youtube) profileFields.social.youtube = youtube;
      if(twitter) profileFields.social.twitter = twitter;
      if(facebook) profileFields.social.facebook = facebook;
      if(linkedin) profileFields.social.linkedin = linkedin;
      if(instagram) profileFields.social.instagram = instagram;

      console.log(profileFields.social.twitter);

      try{
          let profile = await Profile.findOne({ user: req.user.id });
          if(profile){
              //update
              profile = await Profile.findOneAndUpdate(
                  { user: req.user.id }, 
                  {$set: profileFields}, 
                  {new: true}
              );

              return res.json(profile);
          }

          //create new profile
          profile = new Profile(profileFields);
          await profile.save();
          res.json(profile);

        }catch(err){
          console.error(err.message);
          res.status(500).send('Server Error');
        }

});

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get('/', async (req, res) => {
    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    }catch(err){
        console.error(err.message);
        res.status(500).send(('Server Error'));
    }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg:'Profile not found.'});
        }
        res.json(profile);

    }catch(err){
        console.error(err.message);
        if(err.kind == 'ObjectID'){
            return res.status(400).json({msg:'Profile not found.'});
        }
        res.status(500).send(('Server Error'));
    }
});

// @route  DELETE api/profile
// @desc   Delete profile, user and post
// @access Private
router.delete('/', auth,async (req, res) => {
    try{
        await Profile.findOneAndRemove({ user: req.user.id }); //remove profile
        await User.findOneAndRemove({ _id: req.user.id }); //remove user


        res.json({ msg: 'User deleted' });
    }catch(err){
        console.error(err.message);
        res.status(500).send(('Server Error'));
    }
});

// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private
router.put('/experience', [auth,[
    check('title', 'Title is rquired').not().isEmpty(),
    check('company', 'company is rquired').not().isEmpty(),
    check('from', 'from date is rquired').not().isEmpty(),
]], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const{
        title,
        company,
        location,
        from,
        to,
        current,
        decription
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        decription
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile);
    } catch (arr) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experince from profile
// @access Private
router.delete('/experience/:exp_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get the remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// @route  PUT api/profile/education
// @desc   Add profile education
// @access Private
router.put('/education', [auth,[
    check('school', 'school is rquired').not().isEmpty(),
    check('degree', 'degree is rquired').not().isEmpty(),
    check('fieldofstudy', 'Field of study is rquired').not().isEmpty(),
    check('from', 'from date is rquired').not().isEmpty(),
]], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        decription
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        decription
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();

        res.json(profile);
    } catch (arr) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route  DELETE api/profile/education/:eedu_id
// @desc   Delete experince from profile
// @access Private
router.delete('/education/:edu_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get the remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;