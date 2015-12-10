({
    shouldDeps: [
        {
            block: 'modal',
            mods: {
                autoclosable: true,
                theme: 'islands'
            }
        },
        {
            block: 'checkbox',
            mods: { theme: 'islands', size: 'm', checked: true }
        },
        {
            block: 'input',
            mods: { theme: 'islands', size: 'm' }
        },
        {
            block : 'spin',
            tech: 'bemhtml',
            mods : {
                theme: 'islands', size: 'xl', visible: true
            }
        }
    ]
})
