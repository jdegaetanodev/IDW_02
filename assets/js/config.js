
const datosIniciales = {
    
  "especialidades": [
    { "id_especialidad": 1, "nombre": "Cardiología", "img": "cargiologia.jpg", "descripcion": "Se ocupa del diagnóstico, tratamiento y prevención de las enfermedades del corazón y del sistema circulatorio, promoviendo una vida saludable y el cuidado del corazón" },
    { "id_especialidad": 2, "nombre": "Dermatología", "img": "dermatologia.jpg", "descripcion": "Especialidad que estudia, diagnostica y trata las enfermedades de la piel, cabello y uñas, así como problemas estéticos relacionados con la salud cutánea." },
    { "id_especialidad": 3, "nombre": "Gastroenterología", "img": "gastroenterologia.jpg", "descripcion": "Se dedica al estudio y tratamiento de los trastornos del aparato digestivo, incluyendo esófago, estómago, intestinos, hígado y páncreas." },
    { "id_especialidad": 4, "nombre": "Ginecología", "img": "ginecologia.png", "descripcion": "Atiende la salud integral de la mujer, enfocándose en el sistema reproductor femenino, controles preventivos y acompañamiento en diferentes etapas de la vida." },
    { "id_especialidad": 5, "nombre": "Neurología", "img": "neurologia.jpeg", "descripcion": "Especialidad que trata las enfermedades del sistema nervioso, como migrañas, epilepsia, trastornos del movimiento y enfermedades neurodegenerativas." },
    { "id_especialidad": 6, "nombre": "Oftalmología", "img": "oftalmologia.jpg", "descripcion": "Encargada de la prevención, diagnóstico y tratamiento de las enfermedades de los ojos, así como de la corrección de problemas visuales." },
    { "id_especialidad": 7, "nombre": "Ortopedia", "img": "ortopedia.jpg", "descripcion": "Se ocupa de la prevención, diagnóstico y tratamiento de lesiones del sistema musculoesquelético, incluyendo huesos, músculos, articulaciones y ligamentos." },
    { "id_especialidad": 8, "nombre": "Pediatría", "img": "pediatria.jpg", "descripcion": "Brinda atención integral a bebés, niños y adolescentes, velando por su desarrollo físico y emocional en cada etapa de crecimiento." }
  ],
  "obras_sociales": [
    { "id_obra_social": 101, "nombre": "Salud Total" },
    { "id_obra_social": 102, "nombre": "MedFuturo" },
    { "id_obra_social": 103, "nombre": "Sanar Hoy" },
    { "id_obra_social": 104, "nombre": "Mutual Bienestar" },
    { "id_obra_social": 105, "nombre": "ProVida" },
    { "id_obra_social": 106, "nombre": "Universal Salud" }
  ],
  "profesionales": [
    // Cardiología (id_especialidad: 1)
    { "id_profesional": 1001, "matricula": "CM-12345", "apellido": "Gómez", "nombre": "Ana", "id_especialidad": 1, "id_obra_social": 101, "costo_consulta": 4500 },
    { "id_profesional": 1002, "matricula": "CM-23456", "apellido": "Pérez", "nombre": "Luis", "id_especialidad": 1, "id_obra_social": 102, "costo_consulta": 4800 },
    { "id_profesional": 1003, "matricula": "CM-34567", "apellido": "Rodríguez", "nombre": "Sofía", "id_especialidad": 1, "id_obra_social": 103, "costo_consulta": 4200 },
    { "id_profesional": 1004, "matricula": "CM-45678", "apellido": "Fernández", "nombre": "Javier", "id_especialidad": 1, "id_obra_social": 104, "costo_consulta": 5000 },
    
    // Dermatología (id_especialidad: 2)
    { "id_profesional": 1005, "matricula": "DE-56789", "apellido": "López", "nombre": "Martina", "id_especialidad": 2, "id_obra_social": 105, "costo_consulta": 3800 },
    { "id_profesional": 1006, "matricula": "DE-67890", "apellido": "Martínez", "nombre": "Carlos", "id_especialidad": 2, "id_obra_social": 106, "costo_consulta": 4000 },
    { "id_profesional": 1007, "matricula": "DE-78901", "apellido": "Sánchez", "nombre": "Elena", "id_especialidad": 2, "id_obra_social": 101, "costo_consulta": 3900 },
    { "id_profesional": 1008, "matricula": "DE-89012", "apellido": "Ramírez", "nombre": "Andrés", "id_especialidad": 2, "id_obra_social": 102, "costo_consulta": 4100 },
    
    // Gastroenterología (id_especialidad: 3)
    { "id_profesional": 1009, "matricula": "GE-90123", "apellido": "Torres", "nombre": "Lucía", "id_especialidad": 3, "id_obra_social": 103, "costo_consulta": 5200 },
    { "id_profesional": 1010, "matricula": "GE-01234", "apellido": "Flores", "nombre": "Ricardo", "id_especialidad": 3, "id_obra_social": 104, "costo_consulta": 5500 },
    { "id_profesional": 1011, "matricula": "GE-12345", "apellido": "Acosta", "nombre": "Valeria", "id_especialidad": 3, "id_obra_social": 105, "costo_consulta": 5100 },
    { "id_profesional": 1012, "matricula": "GE-23456", "apellido": "Benítez", "nombre": "Pablo", "id_especialidad": 3, "id_obra_social": 106, "costo_consulta": 5300 },

    // Ginecología (id_especialidad: 4)
    { "id_profesional": 1013, "matricula": "GI-34567", "apellido": "Castro", "nombre": "Marina", "id_especialidad": 4, "id_obra_social": 101, "costo_consulta": 4700 },
    { "id_profesional": 1014, "matricula": "GI-45678", "apellido": "Díaz", "nombre": "Felipe", "id_especialidad": 4, "id_obra_social": 102, "costo_consulta": 4900 },
    { "id_profesional": 1015, "matricula": "GI-56789", "apellido": "Herrera", "nombre": "Laura", "id_especialidad": 4, "id_obra_social": 103, "costo_consulta": 4600 },
    { "id_profesional": 1016, "matricula": "GI-67890", "apellido": "Núñez", "nombre": "Diego", "id_especialidad": 4, "id_obra_social": 104, "costo_consulta": 4850 },

    // Neurología (id_especialidad: 5)
    { "id_profesional": 1017, "matricula": "NE-78901", "apellido": "Vargas", "nombre": "Romina", "id_especialidad": 5, "id_obra_social": 105, "costo_consulta": 6000 },
    { "id_profesional": 1018, "matricula": "NE-89012", "apellido": "Rojas", "nombre": "Santiago", "id_especialidad": 5, "id_obra_social": 106, "costo_consulta": 6200 },
    { "id_profesional": 1019, "matricula": "NE-90123", "apellido": "Gutiérrez", "nombre": "Paula", "id_especialidad": 5, "id_obra_social": 101, "costo_consulta": 5900 },
    { "id_profesional": 1020, "matricula": "NE-01234", "apellido": "Molina", "nombre": "Hugo", "id_especialidad": 5, "id_obra_social": 102, "costo_consulta": 6100 },

    // Oftalmología (id_especialidad: 6)
    { "id_profesional": 1021, "matricula": "OF-12345", "apellido": "Silva", "nombre": "Carolina", "id_especialidad": 6, "id_obra_social": 103, "costo_consulta": 4100 },
    { "id_profesional": 1022, "matricula": "OF-23456", "apellido": "Morales", "nombre": "Esteban", "id_especialidad": 6, "id_obra_social": 104, "costo_consulta": 4300 },
    { "id_profesional": 1023, "matricula": "OF-34567", "apellido": "Blanco", "nombre": "Andrea", "id_especialidad": 6, "id_obra_social": 105, "costo_consulta": 4000 },
    { "id_profesional": 1024, "matricula": "OF-45678", "apellido": "Ruiz", "nombre": "Guillermo", "id_especialidad": 6, "id_obra_social": 106, "costo_consulta": 4200 },

    // Ortopedia (id_especialidad: 7)
    { "id_profesional": 1025, "matricula": "OR-56789", "apellido": "Sosa", "nombre": "Julieta", "id_especialidad": 7, "id_obra_social": 101, "costo_consulta": 5800 },
    { "id_profesional": 1026, "matricula": "OR-67890", "apellido": "Vidal", "nombre": "Adrián", "id_especialidad": 7, "id_obra_social": 102, "costo_consulta": 6000 },
    { "id_profesional": 1027, "matricula": "OR-78901", "apellido": "Paz", "nombre": "Natalia", "id_especialidad": 7, "id_obra_social": 103, "costo_consulta": 5700 },
    { "id_profesional": 1028, "matricula": "OR-89012", "apellido": "Ramos", "nombre": "Darío", "id_especialidad": 7, "id_obra_social": 104, "costo_consulta": 5900 },

    // Pediatría (id_especialidad: 8)
    { "id_profesional": 1029, "matricula": "PE-90123", "apellido": "Navarro", "nombre": "Agustina", "id_especialidad": 8, "id_obra_social": 105, "costo_consulta": 3500 },
    { "id_profesional": 1030, "matricula": "PE-01234", "apellido": "Cáceres", "nombre": "Miguel", "id_especialidad": 8, "id_obra_social": 106, "costo_consulta": 3700 },
    { "id_profesional": 1031, "matricula": "PE-12345", "apellido": "Ortiz", "nombre": "Florencia", "id_especialidad": 8, "id_obra_social": 101, "costo_consulta": 3400 },
    { "id_profesional": 1032, "matricula": "PE-23456", "apellido": "Vega", "nombre": "Sebastián", "id_especialidad": 8, "id_obra_social": 102, "costo_consulta": 3600 }
  ]
};