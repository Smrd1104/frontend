import React from 'react'
import loginIcons from "../assets/signin.gif"
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState } from 'react'
import { Link } from 'react-router-dom'
const Login = () => {
  const [showPassword, SetShowPassword] = useState(false)
  const [data, setData] = useState(

    {
      email: "",
      password: ""
    }
  )

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  console.log('data: ', data);
  return (
    <section id='login'>
      <div className='container mx-auto p-4'>
        <div className='bg-white p-4 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto'>
            <img src={loginIcons} alt='login icons' />
          </div>
          {/* login form */}
          <form  className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Email Id:</label>
              <div className='bg-slate-100 p-2 flex '>
                <input
                  type='email'
                  placeholder='enter email'
                  name='email'
                  value={data.email}
                  onChange={handleChange}
                  className='w-full h-full outline-none bg-transparent '
                />

              </div>
            </div>
            <div>
              <label>Password</label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='enter password'
                  name='password'
                  value={data.password}
                  onChange={handleChange}
                  className='w-full h-full outline-none bg-transparent'
                />
                <div className=' cursor-pointer text-lg' onClick={() => SetShowPassword((prev) => !prev)}>
                  <span>
                    {
                      showPassword ? (
                        <FaEyeSlash />) : (<FaEye />)

                    }
                  </span>
                </div>
              </div>

              {/* forgot password */}
              <Link to={"/forgot-password"} className='block ml-auto w-fit hover:underline hover:text-red-500'>
                Forgot password?
              </Link>
            </div>

            <button className='bg-red-600 hover:bg-red-800 w-full max-w-[150px] px-6 py-2 text-white rounded-full hover:scale-110 transition-all duration-300 mx-auto block mt-4 '>Login</button>
          </form>

          {/* sign up */}
          <p className='my-5'>Don't have account? <Link to={"/sign-up"} className='text-red-600 hover:text-red-800 hover:underline '>Sign-up</Link> </p>
        </div>
      </div>
    </section>
  )
}

export default Login