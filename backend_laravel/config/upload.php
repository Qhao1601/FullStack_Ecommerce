<?php

return [
    'image' => [
        'disk' => 'public',
        'max_size' => 5210,
        'allowed_mime_types' => [
            'jpeg',
            'jpg',
            'gif',
            'png',
            'svg',
            'webp',
        ],
        'base_path' =>  'uploads',
        'pipelines' => [
            'default' => [
                'generate_filename' => [
                    'enabled' => true,
                ],
                'resize' => [
                    'enabled' => false,
                    'witdh' => 300,
                    'height' =>200,
                ],
                'optimize' => [
                    'enabled' => false,
                    'quality' => 85
                ],
                'storage' => [
                    'enabled' => false
                ]
            ]
        ]
    ]
];