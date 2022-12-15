import React, { useCallback, createContext } from 'react'
import PropTypes from 'prop-types'
import toast, { Toaster } from 'react-hot-toast'
import notificationCodes from '../constants/notifications.json'
// ----------------------------------------------------------------------

const initialState = {
    showSuccess: () => { },
    showError: () => { },
    showWarning: () => { }
}

const NotificationsContext = createContext(initialState)

// ----------------------------------------------------------------------
NotificationsProvider.propTypes = {
    children: PropTypes.node
}

function NotificationsProvider({ children }) {

  const contextValue = {
    showSuccess: useCallback((message) =>
      toast(notificationCodes[message] || message, { className: 'success bg-green-500 text-white' })
    ),
    showError: useCallback((message) =>
      toast(notificationCodes[message] || message, { className: 'danger bg-red-600 text-white' })
    ),
    showWarning: useCallback((message) =>
      toast(notificationCodes[message] || message, { className: 'warning bg-dark text-white' })
    )
  }

  return (
    <>
      <NotificationsContext.Provider value={contextValue}>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: '',
              duration: 5000,
              // style: {
              //     background: '#363636',
              //     color: '#fff'
              // },
              // Default options for specific types
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black'
                }
              }
            }}
        />
        {children}
      </NotificationsContext.Provider>
    </>
  )
}

export { NotificationsContext, NotificationsProvider }