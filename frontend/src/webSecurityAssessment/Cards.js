import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1> Web Security Assessment Features</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          {/* <ul className='cards__items'>
            <CardItem
              src='https://media.istockphoto.com/id/1331943958/photo/digital-cloud-security-background-concept.jpg?s=612x612&w=0&k=20&c=ktHShoivHgGcXbkgJGUpy6Q5JLYKMGsrbpY0e_4MrSc='
              text='Explore the hidden waterfall deep inside the Amazon Jungle'
              label='Adventure'
              path='/services'
            />
            <CardItem
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx_rEEZdgy_TJcf6YXy9eUDsTmckMkAJL2gs-SYDUa&s'
              text='Travel through the Islands of Bali in a Private Cruise'
              label='Luxury'
              path='/services'
            />
          </ul> */}
          <ul className='cards__items'>
            <CardItem
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWah6dE-jPH6ttLQwlwmcoDp5KmiliLcle6w&usqp=CAU'
              text='Scan Websites for Vulnerabilities and generate Report'
              label='Learn'
              path='/Scan'
             
            />
            <CardItem
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxErRewoEbqTg7YQB1I5Cx5NIv6BLHpRYm2CkpRfxBv8xDewKNl7rawVbsxMVl0mvNkdQ&usqp=CAU'
              text='Learn about different Vulnerabilities and Threats'
              label='Apply your Skills'
              path='/Learn'
            />
            <CardItem
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5mCmXeGsnKcq_iHvUMtklquq7tNttz1-BVFVCDG7pdxguFSqy9M_HrrzjgvMJL_Hjrw0&usqp=CAU'
                text='Work on Projects with fellow developers with Realtime Interaction'
                label='Adrenaline'
                externalLink={true}
                path='http://localhost:5000'
                
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='https://www.simplilearn.com/ice9/free_resources_article_thumb/Top_Cybersecurity_Projects.jpg'
              text='PlaceHolder'
              label='Mystery'
              path='/services'
            />
            <CardItem
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxErRewoEbqTg7YQB1I5Cx5NIv6BLHpRYm2CkpRfxBv8xDewKNl7rawVbsxMVl0mvNkdQ&usqp=CAU'
              text='PlaceHolder'
              label='Adventure'
              path='/products'
            />
            <CardItem
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5mCmXeGsnKcq_iHvUMtklquq7tNttz1-BVFVCDG7pdxguFSqy9M_HrrzjgvMJL_Hjrw0&usqp=CAU'
              text='PlaceHolder'
              label='Adrenaline'
              path='/sign-up'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;