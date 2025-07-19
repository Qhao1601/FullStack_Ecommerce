<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CreateCrudModule extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:crud {name} {--namespace=: the namespace for the CRUD structure}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a complete CRUD struture for a module';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $namespace = $this->option('namespace') ?? $name;
        $this->createController($name, $namespace);
        $this->createRequest($name, $namespace);
        $this->createResource($name, $namespace);
        $this->createModel($name);
        $this->createRepository($name, $namespace);
        $this->createServiceInterface($name, $namespace);
        $this->createService($name, $namespace);
    }

    private function createController($name, $namespace)
    {
        $folder = app_path("Http/Controllers/Api/V1/{$namespace}");
        File::ensureDirectoryExists($folder);
        $stub = $this->getStubs('controller');
        $content = str_replace(
            [
                '{{namespace}}',
                '{{name}}'
            ],
            [
                $namespace,
                $name
            ],
            $stub
        );
        if (!File::exists("{$folder}/{$name}Controller.php")) {
            File::put("{$folder}/{$name}Controller.php", $content);
        }
    }

    private function createRequest($name, $namespace)
    {
        $folder = app_path("Http/Requests/{$namespace}/{$name}");
        File::ensureDirectoryExists($folder);
        $requestFiles = [
            'StoreRequest' => 'store-request',
            'UpdateRequest' => 'update-request',
            'DeleteBulkRequest' => 'bulk-delete-request'
        ];
        foreach ($requestFiles as $key => $stubName) {
            $stub = $this->getStubs($stubName);
            $content = str_replace(
                [
                    '{{namespace}}',
                    '{{name}}'
                ],
                [
                    $namespace,
                    $name,
                ],
                $stub
            );
            if (! File::exists("{$folder}/{$key}.php")) {
                File::put("{$folder}/{$key}.php", $content);
            }
        }
    }


    private function createResource($name, $namespace)
    {
        $folder = app_path("http/Resources/{$namespace}");
        File::ensureDirectoryExists($folder);
        $stub = $this->getStubs('resource');
        $content = str_replace(
            [
                '{{namespace}}',
                '{{name}}'
            ],
            [
                $namespace,
                $name,
            ],
            $stub
        );
        if (! File::exists("{$folder}/{$name}Resource.php")) {
            File::put("{$folder}/{$name}Resource.php", $content);
        }
    }

    private function createModel($name)
    {
        $stub = $this->getStubs('model');
        $content = str_replace('{{name}}', $name, $stub);
        if (!File::exists(app_path("Models/{$name}.php"))) {
            File::put(app_path("Models/{$name}.php"), $content);
        }
    }


    private function createRepository($name, $namespace)
    {
        $folder = app_path("Repositories/{$namespace}");
        File::ensureDirectoryExists($folder);
        $stub = $this->getStubs('repository');
        $content = str_replace(
            [
                '{{namespace}}',
                '{{name}}'
            ],
            [
                $namespace,
                $name,
            ],
            $stub
        );
        if (!File::exists("{$folder}/{$name}Reponsitory.php")) {
            File::put("{$folder}/{$name}Reponsitory.php", $content);
        }
    }

    private function createServiceInterface($name, $namespace)
    {
        $folder = app_path("Services/Interfaces/{$namespace}");
        File::ensureDirectoryExists($folder);
        $stub = $this->getStubs('service-interface');
        $content = str_replace(
            [
                '{{namespace}}',
                '{{name}}'
            ],
            [
                $namespace,
                $name,
            ],
            $stub
        );
        if (! File::exists("{$folder}/{$name}ServiceInterface.php")) {
            File::put("{$folder}/{$name}ServiceInterface.php", $content);
        }
    }

    private function createService($name, $namespace)
    {
        $folder = app_path("Services/Impl/{$namespace}");
        File::ensureDirectoryExists($folder);
        $stub = $this->getStubs('service');
        $content = str_replace(
            [
                '{{namespace}}',
                '{{name}}',
                '{{snakeName}}'
            ],
            [
                $namespace,
                $name,
                Str::snake($name)
            ],
            $stub
        );
        if (!File::exists("{$folder}/{$name}Service.php")) {
            File::put("{$folder}/{$name}Service.php", $content);
        }
    }


    private function getStubs($name)
    {
        return File::get(resource_path("stubs/{$name}.stub"));
    }
}
