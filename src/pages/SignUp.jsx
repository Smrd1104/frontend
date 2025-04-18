import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import loginIcons from "../assets/signin.gif"
import { Link, useNavigate } from 'react-router-dom'
import imageTobase64 from '../helpers/imageTobase64'
import summaryApi from '../common'
import { toast } from 'react-toastify'

const SignUp = () => {
  const [showPassword, SetShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState(false)
  const [data, setData] = useState(

    {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
      profilePic: ""
    }
  )

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.password === data.confirmPassword) {
      const dataResponse = await fetch(summaryApi.signUp.url, {
        method: summaryApi.signUp.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const dataApi = await dataResponse.json(); // <-- add await here

      if (dataApi.success) {
        toast.success(dataApi.message)
        navigate("/login")
      }
      if (dataApi.error) {
        toast.error(dataApi.message)
      }

    } else {
      toast.error("Password and Confirm Password do not match");
    }
  }


  const handleUploadPic = async (e) => {
    const file = e.target.files[0]
    const imagePic = await imageTobase64(file)
    setData((prev) => {
      return {
        ...prev,
        profilePic: imagePic,
      }
    });


  }
  return (
    <section id='signup'>
      <div className='container mx-auto p-4'>
        <div className='bg-white p-4 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <div>
              <img src={data.profilePic || loginIcons} alt='login icons' />
            </div>
            <form>
              <label>
                <div className='text-xs bg-slate-200  text-center absolute bg-opacity-80 pb-4 pt-2 cursor-pointer bottom-0 w-full'>
                  Upload Photo
                </div>
                <input type='file' className='hidden' onChange={handleUploadPic} />
              </label>

            </form>
          </div>
          {/* login form */}
          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Name:</label>
              <div className='bg-slate-100 p-2 flex '>
                <input
                  type='text'
                  placeholder='enter your name'
                  name='name'
                  value={data.name}
                  required
                  onChange={handleChange}
                  className='w-full h-full outline-none bg-transparent '
                />

              </div>
            </div>

            <div className='grid'>
              <label>Email Id:</label>
              <div className='bg-slate-100 p-2 flex '>
                <input
                  type='email'
                  placeholder='enter email'
                  name='email'
                  value={data.email}
                  required
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
                  required
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

            </div>

            <div>
              <label>Confirm Password</label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={confirmPassword ? "text" : "password"}
                  placeholder='enter password'
                  name='confirmPassword'
                  value={data.confirmPassword}
                  required
                  onChange={handleChange}
                  className='w-full h-full outline-none bg-transparent'
                />
                <div className=' cursor-pointer text-lg' onClick={() => setConfirmPassword((prev) => !prev)}>
                  <span>
                    {
                      confirmPassword ? (
                        <FaEyeSlash />) : (<FaEye />)

                    }
                  </span>
                </div>
              </div>


            </div>

            <button className='bg-red-600 hover:bg-red-800 w-full max-w-[150px] px-6 py-2 text-white rounded-full hover:scale-110 transition-all duration-300 mx-auto block mt-4 '>Sign Up</button>
          </form>

          {/* sign up */}
          <p className='my-5'>Already have a account? <Link to={"/login"} className='text-red-600 hover:text-red-800 hover:underline '>Login</Link> </p>
        </div>
      </div>
    </section>
  )
}

export default SignUp