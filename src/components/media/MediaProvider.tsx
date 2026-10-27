"use client";
import {createContext,useContext} from "react";
import type {MediaPlacement} from "@/lib/media/types";
const MediaContext=createContext<Record<string,MediaPlacement>>({});
export function MediaProvider({placements,children}:{placements:Record<string,MediaPlacement>;children:React.ReactNode}){return <MediaContext.Provider value={placements}>{children}</MediaContext.Provider>;}
export function useMediaPlacement(slot?:string){return useContext(MediaContext)[slot??""];}
export function useMediaPlacements(){return useContext(MediaContext);}
