export const loginStructure = () => {
    return {
        title: 'Login',
        description: 'Inicia sesión para acceder a tu cuenta',
        forms: [
            {
                name: 'usuario',
                formControlName: 'username',
                formControlType: 'text',
                placeholder: 'Usuario',
                icon: 'cilUser'
            },
            {
                name: 'contraseña',
                formControlName: 'password',
                formControlType: 'password',
                placeholder: 'Contraseña',
                icon: 'cilLockLocked'
            },
        ],
    }
}