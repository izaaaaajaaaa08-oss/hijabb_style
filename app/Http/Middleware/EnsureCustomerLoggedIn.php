<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCustomerLoggedIn
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()->guest(route('login'))->with('error', 'Silakan login terlebih dahulu untuk mengakses keranjang dan checkout.');
        }

        return $next($request);
    }
}
