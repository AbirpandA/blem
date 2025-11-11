import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex justify-center items-center text-white max-w-4xl mx-auto">{children}</div>
  );
};

export default Container;
