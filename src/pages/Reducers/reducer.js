
 const policyReducer = (state = {
  policylocator: [],
  primaryorjointpolicies:[],
  trustdata:[],
  inactiveprimaryorjointdata:[],
  inactivetrustdata:[],
  inactivepolicydata:[],
  reviewpolicydata:[],
  draftpolicydata:[],
  inactivepolicypersist:"false",
  activepolicypersist:"false",
  incompletepolicypersist:"false"

}, action) => {
    switch (action.type) {
      case 'SAVE_ALL_POLICY_LOCATOR':
        return {...state,
            policylocator: 
                
                action.payload
                
        }
           case 'PRIMARY_OR_JOINT_POLICY_DATA':
            return {...state,
              primaryorjointpolicies:  [
                ...action.payload
            ]      
              
                 
                  
            } 
            case 'TRUST_POLICY_DATA':
           return {...state,
            trustdata: 
            [
              ...action.payload
          ]
           }  
      
            case 'INACTIVE_PRIMARY_OR_JOINT_POLICY_DATA':
            return {...state,
              inactiveprimaryorjointdata:
                
              [
                ...action.payload
            ]
            }  
            case 'INACTIVE_TRUST_POLICY_DATA':
              return {...state,
                inactivetrustdata:
                  
                [
                  ...action.payload
              ]
              }  
              case 'INACTIVE_POLICY_PERSIST':
                return {...state,
                  inactivepolicypersist:
                    
                  action.payload
                }
                case 'ACTIVE_POLICY_PERSIST':
                return {...state,
                  activepolicypersist: action.payload
                }
                case 'INCOMPLETE_POLICY_PERSIST':
                return {...state,
                  incompletepolicypersist:
                    
                  action.payload
                }
                case 'REVIEW_POLICY_DATA':
                  return {...state,
                    reviewpolicydata:
                      
                    action.payload
                  }
                  case 'DRAFT_POLICY_DATA':
                    return {...state,
                      draftpolicydata:
                        
                      action.payload
                    }
              
      default:
        return state
    }
  }

export default policyReducer;