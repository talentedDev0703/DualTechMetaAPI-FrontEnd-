import React from "react";
import "./viewCount.css"

function viewCount(props){  
    const handler = (event)=>{props.onSizeChange(event.target.value)};
    return(
        <div className="view-count" onChange={handler}>
            <label>Per Page</label>
            <select >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value={props.totalCount}>All</option>
            </select>
        </div>
    )
}

export default viewCount;