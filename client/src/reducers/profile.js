import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    laoding: true,
    error: {}
}

export default function(state = initialState, action){
    const { type, paylaod } = action;


    switch(type){
        case GET_PROFILE:
            return{
                ...state,
                profile: paylaod,
                laoding: false
            };
        case PROFILE_ERROR:
            return{
                ...state,
                error: paylaod,
                laoding: false
            };
        case CLEAR_PROFILE:
            return{
                ...state,
                profile: null,
                repos: [],
                laoding: false
            }
        default: 
            return state;
    }
}