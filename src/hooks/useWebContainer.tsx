"use client"
import { WebContainer } from "@webcontainer/api";
import {  useEffect, useRef } from "react";

export const useWebContainer = () => {
    const webContainerRef = useRef<WebContainer | null>(null);
    
        const init = async () => {
            if(!webContainerRef.current){
                console.log("booting")
                webContainerRef.current=await WebContainer.boot()
                console.log("booted")
            }
        };
        useEffect(() => {
          init();
        }, [])
        
    
        return webContainerRef;
    }