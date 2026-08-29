<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Database\Seeders\DemoSeeder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoController extends Controller
{
    /**
     * One-click login into the shared demo account (no sign-up needed).
     * Seeds sample data on first ever visit so the dashboard isn't empty.
     */
    public function login(Request $request, DemoSeeder $seeder): RedirectResponse
    {
        $demo = User::firstOrCreate(
            ['email' => config('demo.email')],
            [
                'name' => 'Démo ChefFlow',
                'password' => Hash::make(Str::random(40)),
            ],
        );

        if (! Product::where('user_id', $demo->id)->exists()) {
            $seeder->run();
        }

        Auth::login($demo);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    /**
     * Reset the demo data back to its seeded state. Only the demo account
     * itself may trigger this.
     */
    public function reset(Request $request, DemoSeeder $seeder): RedirectResponse
    {
        abort_unless(
            optional($request->user())->email === config('demo.email'),
            403,
        );

        $seeder->run();

        return back()->with('message', 'Démo réinitialisée.');
    }
}
