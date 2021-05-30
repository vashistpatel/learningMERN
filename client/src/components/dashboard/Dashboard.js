import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCurrentProfile } from '../../actions/profile';
// import { Fragment } from 'react';
import DashboardActions from './DashboardActions';

import { Link } from 'react-router-dom'

const Dashboard = ({getCurrentProfile, auth:{ user }, profile:{ profile, loading }}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [])

    return loading && profile === null ? (<Spinner />) : (
    <Fragment>
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
            <i className='fas fa-user' /> Welcome {user && user.name}
        </p>
        {profile !== null ? (
            <Fragment>
                <DashboardActions />
                {/* <Experience experience={profile.experience} />
                <Education education={profile.education} />

                <div className='my-2'>
                    <button className='btn btn-danger' onClick={() => deleteAccount()}>
                    <i className='fas fa-user-minus' /> Delete My Account
                    </button>
                </div> */}
                has
            </Fragment>
        ) : (
            <Fragment>
                <p>You have not yet setup a profile please add some info</p>
                <Link to='/create-profile' className='btn btn-primary my-1'>
                    Created Profile
                </Link>
            </Fragment>
        )}
    </Fragment>)
};



Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)