"use client"

import React, { useState } from "react"

import Tiptap from "./Tiptap"

export default function ContentForm() {

    // const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const onchange = (content: string) => {
        // setTitle(e.target.value);
        setContent(content);
        console.log("INSIDE-ONCHANGE: ", content);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form Submitted!")
        console.log("With: ", content);
    }

    return (
        <form onSubmit={handleSubmit} className="min-h-screen mx-auto max-w-3/6 min-w-xl p-2">
            {/* <input type="text" id="title" name="title" onChange={(e)=>handleChange(e)} /> */}
            <div className="flex flex-col space-y-4">
                <Tiptap content={content} onchange={onchange} />
                <button
                    type="submit"
                    className="self-center w-fit my-2 px-4 py-1 rounded-sm bg-slate-700 hover:bg-slate-900
                        transition-all duration-200 shadow-md text-white text-lg hover:cursor-pointer hover:shadow-lg
                        focus:shadow-xl focus:outline-none"
                >Submit</button>
            </div>
        </form>
    );
}