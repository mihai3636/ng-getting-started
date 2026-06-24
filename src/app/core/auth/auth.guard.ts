import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  console.log(`authGuard checking currentUser: `, auth.currentUser());

  if (auth.currentUser()) return true;
  return router.createUrlTree(['/login']);

  //   return toObservable(auth.authReady).pipe(
  //     filter((isReady) => isReady),
  //     take(1),
  //     map(() => {
  //       if (auth.currentUser()) return true;
  //       return router.createUrlTree(['/login']);
  //     }),
  //   );
};

export const authReverseGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  console.log(`authReverseGuard checking currentUser: `, auth.currentUser());

  if (!auth.currentUser()) return true;

  return router.createUrlTree(['/home']);

  //   return toObservable(auth.authReady).pipe(
  //     filter((isReady) => isReady),
  //     take(1),
  //     map(() => {
  //       if (!auth.currentUser()) return true;

  //       return router.createUrlTree(['/home']);
  //     }),
  //   );

  //   if (!auth.currentUser()) {
  //     return true;
  //   }

  //   return router.createUrlTree(['/home']);
};
