import React,{useState} from "react";
import { useEffect } from "react";
import  {MdEdit} from "react-icons/md"
import  {MdSave} from "react-icons/md"
import Pagination from './pagenation';
import data from './account-data.json';
import ViewCount from './viewCount';
function AccountList() {
    
  const [currentPage, setCurrentPage] = useState(1);
  const [curPageSize,setCurPageSize] = useState(10);
  
  let firstPageIndex;
  let lastPageIndex;
  const currentTableData = (sel_page_num = 1, pagesize = 10) => {
      firstPageIndex = (currentPage - 1) * curPageSize;
      lastPageIndex = (Number(firstPageIndex) + Number(curPageSize));
      if(lastPageIndex >=data.length)
        lastPageIndex = data.length;
       return data.slice(firstPageIndex, lastPageIndex);
  };
  const [userlist, setUserlist] = useState(currentTableData(currentPage,curPageSize));
  const [disabled, setDisable] = useState('true');
  const [button, setButton] = useState('edit');
  const [inputStyle, setInputStyle] = useState('');
  const [selectId, setSelectId] = useState('');

  useEffect(() => {
    setCurrentPage(currentPage);
    setCurPageSize(curPageSize);
    setUserlist(currentTableData(currentPage, curPageSize));
  }, [currentPage, curPageSize]);
  
  const userEdit = () => {
     setDisable("");
     if(button === "edit"){
          setButton("save");
          setInputStyle("inputStyle");
     }
     else{
          setButton("edit");
          setDisable("true");
          setInputStyle("");
     }
    
  }

  const onCountHandle = (pagesize) => {
    setCurrentPage(1);
    setCurPageSize(pagesize);
  }
  
  return(
    <div className="table-container">
          <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Symbol</th>
                    <th>Dir.</th>
                    <th>Symbol</th>
                    <th>Dir.</th>
                    <th>Symbol</th>
                    <th>Dir.</th>
                    <th>Symbol</th>
                    <th>Dir.</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody className="table-body">
            {
              userlist.map(
              (item,key)=>{  
                let keys = Object.keys(item);
                keys = keys.slice(1, keys.length) ; 
              return(
                <tr id = {"user"+key} onClick={()=>{ setSelectId(key)}}  key={key} >
                  <td>{key+(currentPage-1)*curPageSize+1}</td>
                  {
                      keys.map(
                          (field,index)=>{
                            return(                     
                              <td key={index}>{(selectId === key)?<input value ={item[field]} 
                              onChange={
                                        (event) => {
                                            let newArr = [...userlist]; 
                                            newArr[key][field] = event.target.value;     
                                            setUserlist(newArr);
                                        } } disabled = {disabled} className = {inputStyle}
                                          />:
                                        <input value ={item[field]}  disabledclassName = "" />
                                    }                                   
                              </td>
                          )
                            
                          }
                      )
                  }
                  {(selectId === key)? <td onClick={userEdit} >{(button === 'edit')?<MdEdit/>:<MdSave/>}</td>: <td onClick={()=>{
                                              setDisable("");
                                              if(button === "edit"){
                                                      setButton("save");
                                                      setInputStyle("inputStyle");
                                              }
                                              else{
                                                      setButton("edit");
                                                      setDisable("true");
                                                      setInputStyle("");
                                              }
                                              
                                              } }><MdEdit/></td>}

                </tr>
              )}
              )}
            </tbody>
          </table>
          <ViewCount
              totalCount={data.length}
              onSizeChange={(pagesize) => onCountHandle(pagesize)}      
             />
          <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={data.length}
              pageSize={curPageSize}
              onPageChange={page => {setCurrentPage(page);}}
              />
    </div>
  )
}
export default AccountList;