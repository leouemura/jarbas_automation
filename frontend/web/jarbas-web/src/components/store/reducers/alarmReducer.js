import { ALARMACTIONS } from '../action';

const initialState = {
    update:{
        id: '',
        hour: '',
        minute: '',
        frequency: '',
        state: ''
    }
}
const jsonObject = (json, id, hour, minute, frequency, state)=>{
    let newJson = JSON.parse(JSON.stringify(json))
    newJson['id'] = id
    newJson['hour'] = hour
    newJson['minute'] = minute
    newJson['frequency'] = frequency
    newJson['state'] = state
    //console.log(newJson)
    return newJson
}
const alarmReducer = (state = initialState, action) => {
    switch(action.type){
        case ALARMACTIONS.UPDATE_ALARM:
            return { update: jsonObject(state.update, action.id, action.hour, action.minute, action.frequency, action.state)}
        default:
            return state
    }
}

export {alarmReducer};