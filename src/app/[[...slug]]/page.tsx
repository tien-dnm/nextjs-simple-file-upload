"use client";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getFiles, submitForm, newFolder, DirResult } from "../server";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { slug: string[] } }) {
  const [files, setFiles] = useState<DirResult[]>();
  const router = useRouter();

  const slugs = useMemo(() => {
    return params.slug?.map((x) => decodeURIComponent(x)) || [];
  }, [params.slug]);

  const sortedFile = useMemo(() => {
    if (files) {
      const cloneFiles = structuredClone(files);
      cloneFiles.sort((a, b) => {
        // Sort "folder" types first
        if (a.type === "folder" && b.type !== "folder") {
          return -1; // a comes before b
        }
        if (a.type !== "folder" && b.type === "folder") {
          return 1; // b comes before a
        }
        // Sort names in ascending order
        return a.path.join("/").localeCompare(b.path.join("/"));
      });
      return cloneFiles;
    }
  }, [files]);

  const getAndSetFiles = useCallback(async () => {
    const files = await getFiles(...slugs);
    setFiles(files);
  }, [slugs]);

  const handleGoBack = () => {
    const cloneSlug = structuredClone(slugs);
    cloneSlug.pop();
    router.push(`/${cloneSlug.join("/")}`);
  };
  const handleNewFolder = async () => {
    await newFolder(...slugs);
    getAndSetFiles();
  };

  const handleChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        formData.append("file", file);
      }
      await submitForm(formData, ...slugs);
      getAndSetFiles();
    }
  };

  useEffect(() => {
    getAndSetFiles();
  }, [slugs, getAndSetFiles]);
  return (
    <>
      <div className="max-w-prose mx-auto">
        <h1 className="font-bold text-5xl text-center my-5">Quản lý file</h1>
        <div className="flex gap-2 my-5">
          <button
            onClick={handleGoBack}
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            ...
          </button>
          <button
            onClick={handleNewFolder}
            type="button"
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900">
            Tạo thư mục
          </button>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleChangeInput}
          />
        </div>
        <div className="flex gap-5 flex-wrap mt-10 items-center">
          {sortedFile?.map((x, i) => {
            if (x.type !== "folder") {
              return (
                <div
                  className="w-32 h-40 flex flex-col items-center"
                  key={i}>
                  <Image
                    alt="test"
                    src={`/api/public/upload/${x.path.join("/")}`}
                    className="object-cover rounded-md w-32 h-32"
                    width={150}
                    height={150}
                  />
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDoubleClick={(e) => {
                      console.log("onDoubleClick");
                    }}
                    className="w-full text-ellipsis overflow-hidden whitespace-nowrap">
                    {x.path[x.path.length - 1]}
                  </div>
                </div>
              );
            }
            return (
              <div
                className="w-32 h-40 flex flex-col items-center"
                key={i}>
                <Link href={`/${x.path.join("/")}`}>
                  <Image
                    alt="test"
                    src={`/api/public/folder.png`}
                    className="object-cover rounded-md w-32 h-32"
                    width={150}
                    height={150}
                  />
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDoubleClick={(e) => {
                      console.log("onDoubleClick");
                    }}
                    className="w-full text-ellipsis overflow-hidden whitespace-nowrap">
                    {x.path[x.path.length - 1]}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
