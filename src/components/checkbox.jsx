import React, {useState} from "react";

const Checkbox = ({handleClick, id, status}) =>{

   const [disabled, setDisabled] = useState(false);
   const handleCheckboxClick = async (e) => {
    setDisabled(true);
    await handleClick(e.target.id, e.target.checked);
    setDisabled(false);
   }
   return  <input
                        id={id}
                        type="checkbox"
                        disabled={disabled}
                        checked={status || false}
                        onChange={handleCheckboxClick}
                        className="h-4 w-4"
    />
}

export default Checkbox;