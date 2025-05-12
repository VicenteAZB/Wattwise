# Wattwise – PMN y PMV

Este repositorio contiene el **PMN (Prototipo Mínimo Navegable)** y el **PMV (Prototipo Mínimo Viable)** del proyecto **Wattwise**, una plataforma diseñada para ayudar a las empresas a **optimizar su consumo de energía** y **monitorear en tiempo real** el uso de recursos eléctricos. El PMN simula la experiencia de usuario, mientras que el PMV ya implementa funciones reales básicas, incluyendo conexión con backend, simulación de sensores, datos en tiempo real y automatización de procesos (alertas de los sensores).


## Características 

- 🔄 **Interacciones simuladas y reales**: Navegación fluida con datos de sensores simulados en tiempo real.
- 📈 **Visualización de datos**: Gráficos de consumo por cada sensor de cada oficina.
- ⚙️ **Simulador de sensores**: Generación periódica de datos que alimentan los gráficos.
- 🔒 **Autenticación**: Control de acceso a oficinas dependiendo del usuario logueado.
- 🔌 **Control y Automatización de Dispositivos**:
  - Se ha implementado una página donde los usuarios pueden encender y apagar dispositivos manualmente.
  - Se añadió la funcionalidad de agregar alertas, permitiendo configurar condiciones (como umbrales y comparadores) para automatizar acciones sobre los dispositivos vinculados a cada sensor.

---

## Tecnologías Usadas

- **React**: Desarrollo del frontend.
- **React Router**: Navegación entre pantallas.
- **React Calendar** y **React Time Picker**: Selección de fechas y horas.
- **Recharts**: Representación de datos con gráficos.
- **Flask**: Backend que gestiona los datos simulados.
- **MongoDB**: Base de datos NoSQL utilizada para almacenar los datos de sensores y configuraciones.
- **Render**: Plataforma de despliegue de aplicaciones que aloja el backend y los servicios web del proyecto.
- **UptimeRobot**: Para mantener activo el backend en Render.


---

## Limitaciones del Hosting (Render)

> El servicio gratuito de Render puede tardar un poco en iniciar debido a que suspende las aplicaciones tras un período de inactividad.  
> Para evitar que el backend y el simulador de sensores se apaguen por completo, se utiliza **UptimeRobot** para enviar solicitudes periódicas cada 5 minutos.  
>  
> ⚠️ Si la página parece lenta al principio, es probable que los servicios estén "despertando". Solo espera unos segundos y deberían funcionar correctamente.

---

## Enlaces

- 🚀 **App desplegada en Render**: [https://wattwise-f3da.onrender.com/](https://wattwise-f3da.onrender.com/)

---

## Instalación Local

Para clonar el repositorio y comenzar a trabajar localmente:

```bash
git clone https://github.com/VicenteAZB/Wattwise.git


