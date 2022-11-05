import { useEffect, useState } from "react";
import { RadioButton } from 'primereact/radiobutton';
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Flex,  } from "@components/layout";
import { ROUTE_PATHS } from "src/constants";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const url = `${process.env.FRONTEND_BASE_URL}${ROUTE_PATHS.RESEND_REGISTRATION_LINK}`;
const title = "Product-Details";
const description =
  "Enables you to resend the registration activation link to your email address.";

  const riderBox = (value) => {
    const [val, setValue] = useState();
    const [options, setOptions] = useState({});
    const router = useRouter();
const handleChange = (selection,name) =>{
   

    setOptions({...options,[name]:selection})
    router.push({pathname: './product-details',query:options},"./product-details");
}
useEffect(() => {
    setValue(value.result); 
    
  }, [value]);

  
return (
    <>
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        url,
        title,
        description,
      }}
    />
     {val?.map((item) => {return( 
    <Flex className="flex-col">
         <div className="border-b-2 border-gray-200">
         <div className="flex-col m-4 md:flex-row">
        
           <div className="p-2"> 
           
         <label className="text-base text-black-700">
             {item.displayName+" "+"rider"}
             
           </label>
           
  </div>
  <div className="Flex flex-col md:flex-row" >        
                        <div className="flex p-2 flex-col space-y-3 md:flex-row  md:ml-20 md:m-4 md:justify-items-end md:space-x-3">
                            <div onClick={() => handleChange("Yes",item.name)}  className="p-field-radiobutton radio-border rounded-md w-24 h-9">
                                <RadioButton  inputId={item.name} name="radioInput1" value="Yes" onChange={(e) =>handleChange("Yes",item.name)} checked={options[item.name] === "Yes"}/>
                                    <label htmlFor="Yes" className="px-2">Yes</label>
                            </div>
                            <div onClick={() => handleChange("No",item.name)}  className="flex p-field-radiobutton radio-border rounded-md w-24 h-9">
                                    <RadioButton inputId={item.name} name="radioInput1" value="No" onChange={(e) => handleChange("No",item.name)} checked={options[item.name] === "No"}/>
                                        <label htmlFor="No" className="px-1">No</label>
                            </div>
                         </div>  
                         </div>
                      
         </div>
   
         </div>
       </Flex>
         )
        }
  )
  }
   
    </>
)
  }
  export default riderBox;
