import React, { useState, useEffect } from 'react';
import RegisterForm from '../components/Authentication/registerForm/RegisterForm';
import LoginForm from '../components/Authentication/loginForm/LoginForm';
import slide1 from '../assets/slide1.png';
import slide2 from '../assets/slide1.png';
import slide3 from '../assets/slide1.png';

const sliderImages = [slide1, slide2, slide3];

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="register-container">
      <div className="register-left">
        <img
          src={sliderImages[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="register-image"
        />
        <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</h3>
        <p>
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <div className="register-dots">
          {sliderImages.map((_, idx) => (
            <span
              key={idx}
              className={`dot${currentSlide === idx ? ' active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>
      </div>
      <div className="register-right">
        {isLogin ? (
          <LoginForm switchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthForm;
