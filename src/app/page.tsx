"use client";
import { submitForm } from "./server";

export default function Home() {
  return (
    <>
      <form action={submitForm}>
        <input name="miti" />
        <input
          name="file"
          type="file"
          multiple
        />
        <button type="submit">submit</button>
      </form>
    </>
  );
}
