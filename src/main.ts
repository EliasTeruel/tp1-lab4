// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,  // Mantenemos la configuración existente
  providers: [
    ...appConfig.providers, // Mantenemos los proveedores existentes
    importProvidersFrom(HttpClientModule) // Añadimos HttpClientModule como proveedor
  ]
}).catch((err) => console.error(err));
