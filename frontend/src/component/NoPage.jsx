import React from 'react';

const NoPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* title area */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-red-500">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700">頁面不存在</h2>
          <p className="text-gray-600 text-lg">
            抱歉，您要找的頁面似乎不存在或已被移除。
          </p>
        </div>
        
        {/* img area- RWD */}
        <div className="relative w-full px-4 transform -translate-y-4 sm:-translate-y-8 md:-translate-y-12 lg:-translate-y-16">
          <div className="max-w-[700px] mx-auto">
            <img 
              src="https://media1.giphy.com/media/T7nKJVS8ZQp26nvEFo/200.webp?cid=ecf05e475a1gzd1cqnc113u1jff6rzzcrtjvbefojibk846h&ep=v1_gifs_search&rid=200.webp&ct=g"
              alt="404 錯誤插圖"
              className="w-full h-auto rounded-lg shadow-lg transition-transform hover:scale-105"
              style={{
                maxWidth: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
        
        {/* button area */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center">
          <button 
            onClick={() => window.history.back()} 
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            返回上一頁
          </button>
          <a 
            href="/" 
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            回到首頁
          </a>
        </div>
      </div>
    </div>
  );
};
export default NoPage;