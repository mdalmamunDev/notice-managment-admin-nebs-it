import PageHeading from "../Components/PageHeading";
import logo from '../assets/images/logo.png'

const DeleteInstructions = () => {

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-white shadow-sm border-b">
          <PageHeading title="How to delete your account?" disbaledBackBtn={true} />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Warning Banner */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-6 mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800">Important Notice</h3>
                  <p className="text-red-700 mt-1">Account deletion is permanent and cannot be undone. All your data will be permanently removed.</p>
                </div>
              </div>
            </div>

            {/* Instructions Container */}
            <div className="p-8 space-y-10">

              {/* Step 1 */}
              <div className="relative">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Log in to your account</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Use your registered email and password to access your account dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Navigate to the profile section</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      Click on your profile icon located at the top-right corner of your screen, then select "Profile" from the dropdown menu.
                    </p>
                    <div className="relative group">
                      <img
                        src="/del-1.png"
                        alt="Profile Section Screenshot"
                        className="w-[400px] max-w-2xl rounded-xl border-2 border-gray-200 shadow-lg transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Click on Settings</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      Once in your profile, locate and click on the "Settings" tab to access your account configuration options.
                    </p>
                    {/* <div className="relative group">
                      <img
                        src="/del-2.png"
                        alt="Settings Page Screenshot"
                        className="w-[400px] max-w-2xl rounded-xl border-2 border-gray-200 shadow-lg transition-transform group-hover:scale-105"
                      />
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Click the Delete Account button</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-2">
                      Scroll down to the bottom of the settings page and locate the
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md font-semibold mx-1">Delete Account</span>
                      button in the danger zone section.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-yellow-800 font-medium">This button is usually located in a "Danger Zone" or "Account Management" section</p>
                      </div>
                    </div>
                    <div className="relative group">
                      <img
                        src="/del-2.png"
                        alt="Delete Account Button Screenshot"
                        className="w-[400px] max-w-2xl rounded-xl border-2 border-gray-200 shadow-lg transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Confirm the deletion</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      A confirmation dialog will appear asking you to verify your decision. Click
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md font-semibold mx-1">Confirm Delete</span>
                      to permanently remove your account and all associated data.
                    </p>
                    <div className="relative group max-w-sm mx-auto md:mx-0">
                      <img
                        src="del-3.png"
                        alt="Confirm Deletion Screenshot"
                        className="w-full rounded-xl border-2 border-gray-200 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300"></div>
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Step 5
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Final Confirmation
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Warning */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-center text-white shadow-xl">
                <div className="flex justify-center mb-4">
                  <svg className="h-12 w-12 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">⚠️ Final Reminder</h3>
                <p className="text-lg text-red-100 leading-relaxed">
                  Once you confirm deletion, your account and all associated data will be permanently removed from our servers. This action cannot be reversed or undone.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteInstructions;