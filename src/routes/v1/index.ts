import express, { Router } from 'express';
import attendanceRoutes from './attendance.routes'

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/attendance',
    route: attendanceRoutes,
  }
];


defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;