import { useEffect, useState, useRef } from "react";
import { Flex } from "@components/layout";
import { forwardRef } from "react";
import { InputMask } from "primereact/inputmask";

export const SecureMaskInput = forwardRef(
  (
    {
      id,
      name,
      secure,
      onChange,
      realvalue,
      error,
      mask,
      value,
      onFocus,
      onBlur,
      icon,
      formik,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [ssnvalue, setssnvalue] = useState();
    const [realvalue1, setrealvalue1] = useState(value);

    useEffect(() => {
      if (mask === true) {
        setssnvalue(realvalue1);
      } else if (mask === false) {
        realvalue1 && setssnvalue("XXX-XX" + realvalue1.substr(-4));
      }
    }, [mask]);

    useEffect(() => {
      if (value != "") {
        setrealvalue1(value);
      }
    }, [value]);

    function formatSSN(e) {
      if (!e) {
        return e;
      }
     
      
      const ssn = e.target.value.replace(/[^0-9 ]/g, "");
      const ssnLength = ssn.length;
    

      if (ssnLength == 0) {
        realvalue(e);
        setssnvalue("");
        setrealvalue1("");
      }

      if (ssnLength < 4) {
        setssnvalue("");
        setrealvalue1("");
      }

      if (ssnLength < 9) {
        return setssnvalue(e.target.value);
      }

      if (mask === false && ssnLength < 10) {
        setrealvalue1(e.target.value);
        realvalue(e);

        return setssnvalue("XXX-XX" + ssn.substr(-4));
      }
      if (mask === true && ssnLength < 10) {
        setrealvalue1(e.target.value);
        realvalue(e);

        return setssnvalue(e.target.value);
      }
    }

    const errorClasses = error
      ? "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 ring-2 ring-red-400 ring-opacity-50"
      : "";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
    const iconClasses = icon ? "pl-10" : "";
   
    return (
      <>
        <InputMask
          ref={ref}
          id={id}
          name={name}
          className={`${errorClasses} ${disabledClasses} ${iconClasses} ${className} `}
          mask="***-**-9999"
          onChange={formatSSN}
          onBlur={onBlur}
          value={ssnvalue ? ssnvalue : "XXX-XX" + value.substr(-4)}
          disabled={disabled}
          placeholder="XXX-XX-1234"
          {...props}
        />
      </>
    );
  }
);
