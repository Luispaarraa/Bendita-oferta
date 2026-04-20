# Bendita Oferta - Configuración de Firebase

## Estado Actual
La app funciona actualmente con **localStorage** (datos guardados en el navegador).

## Para conectar a Firebase

### 1. Crear proyecto en Firebase
1. Ve a https://console.firebase.google.com
2. Crea un nuevo proyecto
3. Activa **Firestore Database** (modo de prueba)

### 2. Obtener configuración
1. En Firebase Console, ve a **Configuración del proyecto** (⚙️)
2.向下滚动到 **Tus apps**
3. Selecciona **</>** (Web)
4. Copia el objeto `firebaseConfig`

### 3. Actualizar firebase-config.js
Edita `firebase-config.js` y reemplaza los valores:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:..."
};
```

### 4. Reglas de Firestore
En Firebase Console → Firestore Database → Reglas, usa:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Listo!
La app detectará automáticamente Firebase y sincronizará los datos.

## Archivos
- `index.html` - Estructura
- `styles.css` - Estilos
- `app.js` - Lógica (soporta localStorage y Firebase)
- `firebase-config.js` - Configuración de Firebase
