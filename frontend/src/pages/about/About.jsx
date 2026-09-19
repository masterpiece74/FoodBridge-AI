import {
  ArrowLeft,
  ArrowRight,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12 lg:px-20">

          {/* LOGO */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3EC] text-[#14532D]">

              <HeartHandshake size={21} />

            </div>

            <div className="leading-tight">

              <p className="text-lg font-bold tracking-tight text-[#14532D]">

                FoodBridge
                <span className="text-[#1F7A4D]">
                  AI
                </span>

              </p>

              <p className="text-[10px] text-gray-400">
                Turning Surplus Into Hope
              </p>

            </div>

          </Link>


          {/* BACK HOME */}

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-[#A7D7B8] hover:text-[#14532D] hover:shadow-sm"
          >

            <ArrowLeft size={16} />

            Back Home

          </Link>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden px-6 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:px-20">

        {/* Background decoration */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#E8F3EC] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#FEF3C7] blur-3xl" />


        <div className="relative mx-auto max-w-5xl text-center">

          {/* BADGE */}

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D7E8DC] bg-white px-4 py-2 text-sm font-medium text-[#14532D] shadow-sm">

            <Sparkles size={16} />

            About FoodBridge AI

          </div>


          {/* TITLE */}

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-[#14532D] md:text-6xl lg:text-7xl">

            Turning surplus food into{" "}

            <span className="text-[#1F7A4D]">
              meaningful impact.
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">

            FoodBridge AI is a digital food redistribution platform
            designed to connect surplus food with communities that
            need it most — helping reduce waste while creating
            measurable social impact.

          </p>

        </div>

      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}

      <section className="px-6 pb-20 md:px-12 lg:px-20">

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">

          {/* OUR STORY */}

          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm md:p-10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#14532D]">

              <HeartHandshake size={27} />

            </div>


            <p className="text-sm font-semibold uppercase tracking-widest text-[#1F7A4D]">
              Our Mission
            </p>


            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#14532D]">
              Food should reach people, not landfills.
            </h2>


            <p className="mt-5 leading-7 text-gray-600">

              Every day, perfectly usable food can become surplus
              while families and communities face food insecurity.
              FoodBridge AI creates a bridge between these two
              realities.

            </p>


            <p className="mt-4 leading-7 text-gray-600">

              By bringing donors, recipient organisations and
              volunteers together on one platform, we make food
              redistribution easier to coordinate, easier to track
              and more transparent.

            </p>

          </div>


          {/* VISION */}

          <div className="rounded-[2rem] bg-[#14532D] p-8 text-white shadow-xl md:p-10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

              <Target size={27} />

            </div>


            <p className="text-sm font-semibold uppercase tracking-widest text-[#A7D7B8]">
              Our Vision
            </p>


            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              A world where surplus becomes opportunity.
            </h2>


            <p className="mt-5 leading-7 text-white/75">

              We envision communities where businesses,
              individuals, organisations and volunteers can work
              together to redirect excess food toward people who
              need it.

            </p>


            <div className="mt-8 flex items-center gap-3 text-sm text-white/80">

              <ShieldCheck
                size={18}
                className="text-[#A7D7B8]"
              />

              Built around trust, coordination and measurable impact.

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW WE CREATE IMPACT
      ===================================================== */}

      <section className="border-y border-gray-100 bg-white px-6 py-20 md:px-12 md:py-24 lg:px-20">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#1F7A4D]">
              How FoodBridge Works
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#14532D] md:text-5xl">
              One platform. Three communities. One shared mission.
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              FoodBridge AI coordinates the people and organisations
              needed to move surplus food from donation to delivery.
            </p>

          </div>


          {/* CARDS */}

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* DONORS */}

            <div className="rounded-3xl border border-gray-100 bg-[#FAFAF7] p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#14532D]">

                <Leaf size={23} />

              </div>

              <h3 className="mt-6 text-xl font-bold text-[#14532D]">
                Donors
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Businesses and individuals can list surplus food
                and make it available to communities that need it.
              </p>

            </div>


            {/* RECIPIENTS */}

            <div className="rounded-3xl border border-gray-100 bg-[#FAFAF7] p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#14532D]">

                <Users size={23} />

              </div>

              <h3 className="mt-6 text-xl font-bold text-[#14532D]">
                Recipients
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Verified organisations can discover available food
                and connect with donations based on their needs.
              </p>

            </div>


            {/* VOLUNTEERS */}

            <div className="rounded-3xl border border-gray-100 bg-[#FAFAF7] p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#14532D]">

                <HeartHandshake size={23} />

              </div>

              <h3 className="mt-6 text-xl font-bold text-[#14532D]">
                Volunteers
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Volunteers help move accepted donations from pickup
                points to the communities receiving them.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          AI SECTION
      ===================================================== */}

      <section className="px-6 py-20 md:px-12 md:py-24 lg:px-20">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-[2rem] bg-gradient-to-br from-[#0B2F1A] via-[#14532D] to-[#1F7A4D] p-8 text-white shadow-2xl md:p-12 lg:p-16">

            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">

              <div>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

                  <Sparkles size={27} />

                </div>


                <p className="text-sm font-semibold uppercase tracking-widest text-[#A7D7B8]">
                  Intelligent Coordination
                </p>


                <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                  Technology that helps food move where it matters.
                </h2>


                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">

                  FoodBridge AI uses intelligent matching and
                  prioritisation to help connect available food with
                  recipient needs while considering factors such as
                  food type, quantity, urgency and location.

                </p>

              </div>


              {/* AI FEATURES */}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

                  <p className="font-semibold">
                    Smart Matching
                  </p>

                  <p className="mt-1 text-sm text-white/65">
                    Connect donations with relevant recipient needs.
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

                  <p className="font-semibold">
                    Freshness Awareness
                  </p>

                  <p className="mt-1 text-sm text-white/65">
                    Help prioritise food based on time-sensitive
                    information.
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

                  <p className="font-semibold">
                    Impact Intelligence
                  </p>

                  <p className="mt-1 text-sm text-white/65">
                    Track meals rescued and people supported.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-6 pb-24 md:px-12 lg:px-20">

        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#D7E8DC] bg-white p-8 text-center shadow-sm md:p-12">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#14532D]">

            <HeartHandshake size={27} />

          </div>


          <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#14532D] md:text-4xl">
            Ready to help turn surplus into hope?
          </h2>


          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">

            Join the FoodBridge community and become part of a
            connected food rescue ecosystem.

          </p>


          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#14532D] px-7 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#1F7A4D]"
            >

              Create an account

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />

            </Link>


            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 px-7 py-4 font-semibold text-[#14532D] transition hover:-translate-y-1 hover:border-[#14532D] hover:shadow-md"
            >

              Login

            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-gray-100 bg-white px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

          <p className="text-sm text-gray-500">

            © {new Date().getFullYear()} FoodBridge AI.
            Turning Surplus Into Hope.

          </p>


          <Link
            to="/"
            className="text-sm font-semibold text-[#14532D] hover:text-[#1F7A4D]"
          >

            Back to FoodBridge

          </Link>

        </div>

      </footer>

    </div>
  );
}

export default About;

