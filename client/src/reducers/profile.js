import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_REPOS } from "../actions/types";

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
        case UPDATE_PROFILE:
            return{
                ...state,
                profile: paylaod,
                laoding: false
            };
        case GET_PROFILES:
            return{
                ...state,
                profiles: paylaod,
                laoding: false
            }
        case PROFILE_ERROR:
            return{
                ...state,
                error: paylaod,
                laoding: false,
                profile: null
            };
        case CLEAR_PROFILE:
            return{
                ...state,
                profile: null,
                repos: [],
                laoding: false
            }
        case GET_REPOS:
            return{
                ...state,
                repos: paylaod,
                laoding: false
            }
        default: 
            return state;
    }
}