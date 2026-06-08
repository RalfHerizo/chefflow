<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blocks destructive account actions (profile edit/delete, password change)
 * for the shared demo account, so a visitor cannot lock everyone else out.
 */
class EnsureNotDemo
{
    public function handle(Request $request, Closure $next): Response
    {
        if (optional($request->user())->email === config('demo.email')) {
            abort(403, 'Action désactivée pour le compte démo.');
        }

        return $next($request);
    }
}
