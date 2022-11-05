import { Sidebar } from 'primereact/sidebar';
import { useEffect,useState } from "react";
import { Divider } from 'primereact/divider';
import { Flex } from '@components/layout'
import { Button } from 'primereact/button';
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { IMAGE_PATHS, ROUTE_PATHS } from 'src/constants';
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";  



let items = [
    {
        label: 'New Application',
        icon:IMAGE_PATHS.NEWAPP,
        command:()=>{ window.location.href="/application/qualifiedfunds"}
    },
    {
      label: 'My Policies',
  },
  {
    label: 'My Applications',
  }
    
  ]
  
export const Sider = () => {
  const router = useRouter();
  const [policystatus, setStatus] = useState([]);

  
  useEffect(() => {

    const userinfo = jwt.decode(localStorage.getItem("cognito_id_token"));
    if (userinfo)
    {
    sessionStorage.setItem("userName", userinfo.sub);
    var polciyArray=JSON.parse(localStorage.getItem("All_Policy_Status"));
    setStatus(polciyArray);
    }
  }, []);

  const routeUsers = (value) => {
    const pl=sessionStorage.getItem("policyLocator")
    localStorage.removeItem("esignature_started");
    sessionStorage.removeItem("policyLocator")
    sessionStorage.removeItem("beneficiaryLocator")
    sessionStorage.removeItem("AL")
    sessionStorage.removeItem("sentId")
    if(pl){
        sessionStorage.removeItem(pl.toString());
      }
      
       sessionStorage.removeItem("DeletedBeneLocator");
      sessionStorage.removeItem("exposures");
  
    if (value.find(item => item.includes("Active"))) {
      router.push(
        { pathname: "/dashboard/my-policies", query: { index: 0 } },
        "/dashboard/my-policies"
      );
    }  if (value.find(item => item.includes("Cancelled"))) {
      router.push(
        { pathname: "/dashboard/my-policies", query: { index: 1 } },
        "/dashboard/my-policies"
      );
    }

   if(!value.find(item => item.includes("Active")) && !value.find(item => item.includes("Cancelled"))){
    router.push(
      { pathname: "/dashboard/my-policies", query: { index: 0 } },
      "/dashboard/my-policies"
    );
   }


  };
  const routeUsers1 = (value) => {
      const pl=sessionStorage.getItem("policyLocator")
    localStorage.removeItem("esignature_started");
    sessionStorage.removeItem("policyLocator")
    sessionStorage.removeItem("beneficiaryLocator")
    sessionStorage.removeItem("AL")
    sessionStorage.removeItem("sentId")
    if(pl){
        sessionStorage.removeItem(pl.toString());
      }
      
      sessionStorage.removeItem("exposures");
    if (value.find(item => item.includes("In Review"))) {
      router.push(
        { pathname: "/dashboard/my-applications", query: { index: 0 } },
        "/dashboard/my-applications"
      );
    } if (value.find(item => item.includes("Draft"))) {
     
      router.push(
        { pathname: "/dashboard/my-applications", query: { index: 1 } },
        "/dashboard/my-applications"
      );
    }
    if(!value.find(item => item.includes("In Review")) && !value.find(item => item.includes("Draft"))){
      router.push(
        { pathname: "/dashboard/my-applications", query: { index: 0 } },
        "/dashboard/my-applications"
      );
    }

  
 
  
  };

  const handleClick=()=>{
    localStorage.removeItem("esignature_started");
    sessionStorage.removeItem("policyLocator")
    sessionStorage.removeItem("beneficiaryLocator")
    sessionStorage.removeItem("AL")
    sessionStorage.removeItem("sentId")
    
    router.push(ROUTE_PATHS.FUNDS)
  }
  const app=router.pathname.includes("/application")
  const policy=router.pathname.includes("/my-policies")
  const myapp=router.pathname.includes("/my-applications")



    return (<>
     <Sidebar className="sider hidden  lg:inline-block md:inline-block" showCloseIcon={false} visible={true} >
      {app?<Flex onClick={handleClick} className={app?"new-app":""}>
          <img  src={IMAGE_PATHS.NEWAPP}/>
          <h5 className="p-3 sidebar-menu">New Application</h5>
        </Flex>: 
        <Button  onClick={handleClick}  style={{ "right":"10px"}} className="borderRadius btncolor w-full ">
       <div>
             <h3 className="text-sm font-semibold" >New Application</h3>
             <h6 className="text-xs text-left">apply now</h6>
             </div>
             <img className="ml-4" src={IMAGE_PATHS.ARROW} />
            </Button> }
          <Divider />
     

          <Flex 
           onClick={() => {
            routeUsers(policystatus);
          
           
          }}
          className={policy?"new-app":""}>
            <img src={IMAGE_PATHS.POLICY}/>
            <h5 className="p-3 sidebar-menu">My Policies</h5> 
          </Flex>

          <Flex 
           onClick={() => {
            routeUsers1(policystatus);
         
           
          }}
          className={myapp?"new-app":""}>
            <img src={IMAGE_PATHS.MYAPP}/>
            <h5 className="p-3 sidebar-menu">My Applications</h5>
          </Flex>
       
      </Sidebar>
    </>);
};
