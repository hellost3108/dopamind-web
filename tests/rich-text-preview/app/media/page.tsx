"use client";
import {useEffect,useState} from "react";
import {ImageEditor} from "@/components/admin/media/ImageEditor";
import {MediaLibrary,getMediaData} from "@/components/admin/media/MediaLibrary";
import {MediaProvider} from "@/components/media/MediaProvider";
import {SiteImage} from "@/components/media/SiteImage";
import type {MediaPlacement} from "@/lib/media/types";
export default function MediaPreview(){const [placements,setPlacements]=useState<Record<string,MediaPlacement>>({});useEffect(()=>{getMediaData().then(data=>setPlacements(data.placements)).catch(()=>{});},[]);return <MediaProvider placements={placements}><main className="mx-auto max-w-5xl space-y-8 p-6"><h1 className="font-serif text-3xl">Thử trình quản lý ảnh</h1><ImageEditor id="test-image" slot="home.hero.mobile" value="/images/homepage/hero/H02.png" alt="Ảnh gốc" onSaved={async()=>setPlacements((await getMediaData()).placements)}/><section data-testid="public-media" className="relative h-64 overflow-hidden"><SiteImage native slot="home.hero.mobile" src="/images/homepage/hero/H02.png" alt="Ảnh gốc" fill className="object-cover"/></section><MediaLibrary/></main></MediaProvider>;}
