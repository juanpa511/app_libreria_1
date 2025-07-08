// Script de prueba para verificar el login
const API_BASE_URL = 'http://localhost:8087/api';

// Función para probar el endpoint de prueba
async function testAuthEndpoint() {
    try {
        console.log('🔍 Probando endpoint de prueba...');
        const response = await fetch(`${API_BASE_URL}/auth/test`);
        const data = await response.text();
        console.log('✅ Endpoint de prueba:', data);
        return true;
    } catch (error) {
        console.error('❌ Error en endpoint de prueba:', error);
        return false;
    }
}

// Función para probar el login
async function testLogin(email, password) {
    try {
        console.log(`🔍 Probando login con: ${email}`);
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('✅ Respuesta del login:', data);
        return data;
    } catch (error) {
        console.error('❌ Error en login:', error);
        return null;
    }
}

// Función para probar el login con debug
async function testDebugLogin(email, password) {
    try {
        console.log(`🔍 Probando login con debug: ${email}`);
        const response = await fetch(`${API_BASE_URL}/auth/debug-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('✅ Respuesta del debug login:', data);
        return data;
    } catch (error) {
        console.error('❌ Error en debug login:', error);
        return null;
    }
}

// Función principal de prueba
async function runTests() {
    console.log('🚀 Iniciando pruebas de autenticación...\n');
    
    // 1. Probar endpoint de prueba
    const authWorking = await testAuthEndpoint();
    if (!authWorking) {
        console.log('❌ El backend no está respondiendo. Verifica que esté ejecutándose en el puerto 8087');
        return;
    }
    
    // 2. Probar login normal
    console.log('\n--- Probando login normal ---');
    const loginResult = await testLogin('test@example.com', 'password123');
    
    // 3. Probar login con debug
    console.log('\n--- Probando login con debug ---');
    const debugResult = await testDebugLogin('test@example.com', 'password123');
    
    console.log('\n🎯 Resumen de pruebas:');
    console.log('- Backend funcionando:', authWorking ? '✅' : '❌');
    console.log('- Login normal:', loginResult && loginResult.token ? '✅' : '❌');
    console.log('- Login debug:', debugResult ? '✅' : '❌');
    
    if (loginResult && loginResult.message) {
        console.log('📝 Mensaje del login:', loginResult.message);
    }
    if (debugResult && debugResult.message) {
        console.log('📝 Mensaje del debug:', debugResult.message);
    }
}

// Ejecutar las pruebas
runTests().catch(console.error); 