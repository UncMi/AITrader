/* eslint-disable no-unused-vars */
import React, {	Component } from 'react';
import {useEffect, useState} from 'react';



function Forex(){

	useEffect(() => {
		axios.get("http://localhost:3001/forex").then((response) => {
		  console.log(respone);
		});
	  }, []);

	return(
	<> 
	hi 
	</>
	)

}

export default Forex;