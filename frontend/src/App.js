import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Signin from './components/Signin';
import RootLayout from './components/RootLayout';
import Home from './components/Home';
//import Signup from './components/Signup';
import ErrorPage from './components/ErrorPage';
import Dashboard from './components/Dashboard';
function App() {

  let router=createBrowserRouter([
    {
      path:'',
      element:<RootLayout/>,
      errorElement:<ErrorPage/>,
      children:[
        {
          path:'',
          element:<Home/>
        },{
          path:'/signin',
          element:<Signin/>
        },{
          path:'/dashboard',
          element:<Dashboard/>
        }
      ]
    }
  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
