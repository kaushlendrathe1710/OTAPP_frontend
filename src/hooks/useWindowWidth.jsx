import {useLayoutEffect, useState} from 'react'

export const useWindowWidth = () => {

    const [width, setWidth] = useState(window.innerWidth);

    useLayoutEffect(()=>{
        function getWindowWidth(e){
            setWidth(e.target.innerWidth);
        }
        window.addEventListener("resize",getWindowWidth);

        return ()=>{
            window.removeEventListener("resize", getWindowWidth);
        }
    },[])
  return width;
}
