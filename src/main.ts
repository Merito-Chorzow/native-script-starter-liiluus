import 'zone.js';
import './polyfills';
import { runNativeScriptAngularApp, bootstrapApplication, provideNativeScriptRouter, provideNativeScriptHttpClient } from "@nativescript/angular";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

runNativeScriptAngularApp({
  appModuleBootstrap: () =>
    bootstrapApplication(AppComponent, {
      providers: [
        provideNativeScriptRouter(routes),
        provideNativeScriptHttpClient(),
      ],
    }),
});