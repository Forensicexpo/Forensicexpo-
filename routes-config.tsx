import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));
const Events = lazy(() => import('@/pages/Events'));
const EventDetails = lazy(() => import('@/pages/EventDetails'));
const News = lazy(() => import('@/pages/News'));
const NewsDetails = lazy(() => import('@/pages/NewsDetails'));
const Contact = lazy(() => import('@/pages/Contact'));
const Publications = lazy(() => import('@/pages/Publications'));
const SubmitPaper = lazy(() => import('@/pages/SubmitPaper'));
const TrackPaper = lazy(() => import('@/pages/TrackPaper'));
const Payment = lazy(() => import('@/pages/Payment'));
const Login = lazy(() => import('@/pages/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminEvents = lazy(() => import('@/pages/admin/Events'));
const AdminNews = lazy(() => import('@/pages/admin/News'));
const AdminRegistrations = lazy(() => import('@/pages/admin/Registrations'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminPapers = lazy(() => import('@/pages/admin/Papers'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/events',
    element: <Events />,
  },
  {
    path: '/events/:id',
    element: <EventDetails />,
  },
  {
    path: '/news',
    element: <News />,
  },
  {
    path: '/news/:id',
    element: <NewsDetails />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/publications',
    element: <Publications />,
  },
  {
    path: '/publications/submit',
    element: <SubmitPaper />,
  },
  {
    path: '/publications/track',
    element: <TrackPaper />,
  },
  {
    path: '/publications/payment',
    element: <Payment />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/events',
    element: <AdminEvents />,
  },
  {
    path: '/admin/news',
    element: <AdminNews />,
  },
  {
    path: '/admin/registrations',
    element: <AdminRegistrations />,
  },
  {
    path: '/admin/users',
    element: <AdminUsers />,
  },
  {
    path: '/admin/papers',
    element: <AdminPapers />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
