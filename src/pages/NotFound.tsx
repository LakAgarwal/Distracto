import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function NotFound() {
  let l = useLocation()
  useEffect(() => {
    console.log("oops lol", l.pathname)
  })

  return (
    <div style={{ minHeight: "100px", display: "block", background: "pink" }}>
      <h5>404</h5>
      <h2>uhhh this page is gone i guess</h2>
      <a href="/" style={{ color: "green", fontWeight: "lighter", fontSize: 10 }}>Go Home Maybe?</a>
    </div>
  )
}

export default NotFound
