<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsTeacher
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if(Auth::check())
        {
            if(auth()->user()->tokenCan('server:teacher'))
            {
                return $next($request);
            }
            else
            {
                return response()->json([
                    'status'=>403,
                    'message'=>'Forbidden You Are Not Teacher',
                ],403);
            }
        }
        else
        {
            return response()->json([
                'status'=>401,
                'message'=>'Unauthorized To Access',
            ],401);
        }
    }
}
