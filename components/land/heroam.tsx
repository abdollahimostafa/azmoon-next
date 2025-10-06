  import Image from "next/image"
  const Heroam = () => {
return(
   <div className="relative bg-gray-50 z-0 ">

      <div className="absolute bottom-0 right-0 overflow-hidden lg:inset-y-0">
        <Image
          className="w-auto h-full z-1"
          src="/background- pattern.png"
          alt=""
          height={1000}
          width={1000}
        />
      </div>

      <header className="relative py-4 md:py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <a
                href="#"
                title="ماد – مرجع آموزش دستیاری"
                className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                <Image
                  className="w-auto h-20"
                  src="/logo.png"
                  alt="ماد logo"
                  width={400}
                  height={400}
                />
              </a>
            </div>

          

            <div className=" lg:flex lg:ml-16 lg:items-center lg:justify-center lg:space-x-10">

              <a
                href="#login"
                className=" border border-gray-900 rounded-xl text-base font-medium text-gray-900 transition-all duration-200 px-5 py-2 focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                ورود
              </a>

              <a
                href="#signup"
                className="hidden lg:flex px-5 py-2 text-base font-semibold leading-7 text-gray-900 transition-all duration-200 bg-transparent border border-gray-900 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white"
              >
                ثبت‌نام رایگان
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-12 sm:py-16 lg:pt-8 lg:pb-15">
                      <a href="https://t.me/madresidency"
                  target="_blank" 
  rel="noopener noreferrer"

          className=" cursor-pointer -mt-10 mb-8 text-sm block bg-gradient-to-r from-green-800 to-green-500 p-4 text-center text-white  shadow-lg hover:scale-[1.02] transition-transform duration-300"
        >
          🎉 تهیه پکیج تمامی آزمون های ماد با تخفیف ویژه!! کلیک کنید
        </a>
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-1 sm:gap-y-20 ">
                        <div className="col-span-1  ">
              <Image className="w-full mx-auto rounded-xl" src="/jj.jpg" alt="ماد – مرجع آموزش دستیاری"  width={1000} height={1000}/>
            </div>

            <div className="text-center xl:col-span-3 lg:text-left md:px-16 lg:px-0">
              <div className="max-w-sm mx-auto sm:max-w-md md:max-w-full">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">
                  آزمون آنلاین و آماده‌سازی دستیاران پزشکی
                </h1>

                <div className="mt-8 lg:mt-12 lg:flex lg:items-center">
                  <div className="flex justify-center flex-shrink-0 -space-x-4 overflow-hidden lg:justify-start">
                    <Image
                      className="inline-block rounded-full w-14 h-14 ring-2 ring-white"
                      src="/avatar-male.png"
                      alt="avatar"
                      width={1000}
                      height={1000}
                    />
                    <Image
                      className="inline-block rounded-full w-14 h-14 ring-2 ring-white"
                      src="/avatar-female-1.png"
                      alt="avatar"
                                            width={100}
                      height={100}

                    />
                    <Image
                      className="inline-block rounded-full w-14 h-14 ring-2 ring-white"
                      src="/avatar-female-2.png"
                      alt="avatar"
                                            width={100}
                      height={100}

                    />
                  </div>

                  <p className="mt-4 text-lg text-gray-900 lg:mt-0 lg:ml-4 font-pj">
                    بیش از <span className="font-bold">۴۶۰۰ پزشک و دستیار</span> از ماد استفاده کرده‌اند و آماده‌سازی خود را شروع کرده‌اند
                  </p>
                </div>
              </div>

              <div className="mt-8 sm:flex sm:items-center sm:justify-center lg:justify-start sm:space-x-5 lg:mt-12">
                <a
                  href="#start"
                  className="inline-flex items-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600"
                >
                  شروع آزمون
                </a>

                <a
                  href="#download"
                  className="inline-flex items-center px-4 py-4 mt-4 text-lg font-bold transition-all duration-200  border border-transparent sm:mt-0 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 bg-gray-200 focus:bg-gray-200"
                >
                  
پشتیبانی                </a>
              </div>
            </div>

            <div className="xl:col-span-2 mb-11">
              <Image className="w-full mx-auto rounded-xl" src="/tqa.jpg" alt="ماد – مرجع آموزش دستیاری"  width={1000} height={1000}/>
            </div>
          </div>
        </div>
      </section>
        <section className="py-2 bg-gray-50 sm:py-16 lg:py-2 -mt-10">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl font-pj">
            ویژگی‌های کلیدی ماد
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-8 font-pj">
            ماد به شما کمک می‌کند هر مرحله از آماده‌سازی دستیاران پزشکی را با بازخورد دقیق و ابزارهای هوشمند انجام دهید
          </p>
        </div>

        <div className="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:grid-cols-3 md:gap-0 xl:mt-24">
          {/* Support */}
          <div className="md:p-8 lg:p-14">
            <svg
              className="mx-auto"
              width="46"
              height="46"
              viewBox="0 0 46 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45 29V23C45 10.85 35.15 1 23 1C10.85 1 1 10.85 1 23V29"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 29H1V41C1 43.209 2.791 45 5 45H13V29Z"
                fill="#D4D4D8"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M45 29H33V45H41C43.209 45 45 43.209 45 41V29Z"
                fill="#D4D4D8"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">پشتیبانی</h3>
            <p className="mt-5 text-base text-gray-600 font-pj">
              ماد همیشه همراه شماست؛ از سوالات فنی تا کمک در آزمون‌ها، پشتیبانی کاملی دریافت خواهید کرد
            </p>
          </div>

          {/* Sales / Growth */}
          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200">
            <svg
              className="mx-auto"
              width="46"
              height="46"
              viewBox="0 0 46 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27 27H19V45H27V27Z"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 37H1V45H9V37Z"
                fill="#D4D4D8"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M45 17H37V45H45V17Z"
                fill="#D4D4D8"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 17L15 7L23 15L37 1"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 1H37V10"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">رشد و پیشرفت</h3>
            <p className="mt-5 text-base text-gray-600 font-pj">
              با ماد می‌توانید روند پیشرفت خود را دنبال کنید و مهارت‌هایتان را مرحله به مرحله بهبود دهید
            </p>
          </div>

          {/* Onboarding */}
          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200">
            <svg
              className="mx-auto"
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M41 1H1V41H41V1Z"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 7H7V20H18V7Z"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 26H7V35H18V26Z"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M35 7H24V35H35V7Z"
                fill="#D4D4D8"
                stroke="#161616"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">آموزش گام‌به‌گام</h3>
            <p className="mt-5 text-base text-gray-600 font-pj">
              فرآیند آماده‌سازی و آموزش دستیاران پزشکی را به صورت مرحله‌ای و قابل پیگیری ارائه می‌دهد
            </p>
          </div>

          {/* Product */}
            </div>
            
      </div>
      
    </section>
    </div>
)
   }
   export default Heroam
