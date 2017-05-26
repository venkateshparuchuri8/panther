export function validate(name, value, validators = [], errors = {}){
  for(let validator of validators) {
      if(validator == "required"){
        if(!value){
          errors[name] = 'This field is required';
          break;
        } else {
          delete errors[name];
        }
      }
      if(validator == "max15"){
        if(value.length > 15){
          errors[name] = 'This field should be 15';
          break;
        } else {
          delete errors[name];
        }
      }
      if(validator == "url"){
        let urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        if(!urlregex.test(value)) {
          errors[name] = 'Please enter a valid URL starting with http or https';
          break;
        } else {
          delete errors[name];
        }
      }
    }
    return errors;
}


