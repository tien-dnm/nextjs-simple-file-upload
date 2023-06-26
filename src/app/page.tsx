"use client";
import { useEffect, useState } from "react";
import { submitForm, getFiles } from "./server";
import Image from "next/image";

export default function Home() {
  const [hi, setHi] = useState<string[]>();
  useEffect(() => {
    getFiles().then((x) => {
      setHi(x);
    });
  }, []);
  return (
    <>
      <form
        action={async (formData) => {
          submitForm(formData).then((x) => {
            getFiles().then((x) => {
              setHi(x);
            });
          });
        }}>
        <input
          name="file"
          type="file"
          multiple
        />
        <button type="submit">submit</button>
      </form>
      <div className="flex gap-2 flex-wrap mt-10">
        {hi?.map((x) => {
          return (
            <div
              className="w-40 h-40 relative "
              key={x}>
              <Image
                alt="test"
                src={`/api/public/upload/${x}`}
                className="object-cover rounded-md"
                fill
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
