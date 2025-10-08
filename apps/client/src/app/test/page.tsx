import React from 'react'

import { auth } from "@clerk/nextjs/server";


const test = async() => {

  const { getToken } = await auth();

const token = await getToken();
console.log(token);

const res = await fetch("http://localhost:8000/test", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await res.json()
console.log(data);
console.log("hi")

  return (
    <div>test Page</div>
  )
}

export default test