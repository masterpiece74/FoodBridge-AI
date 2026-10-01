import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-paper text-ink">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10 lg:px-12">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center border border-deep-green bg-deep-green">
              <span className="text-sm font-medium text-white">
                F
              </span>
            </div>

            <div className="leading-none">
              <p className="text-[15px] font-medium tracking-[-0.02em]">
                FoodBridge
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted">
                AI
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="fb-arrow text-[11px] uppercase tracking-[0.08em] text-muted hover:text-green"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.2}
            />
            Back home
          </Link>
        </div>
      </header>


      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[0.85fr_1.15fr]">

          {/* Label column */}
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
            <div className="flex h-full flex-col justify-between">

              <div>
                <p className="fb-label text-green">
                  About FoodBridge
                </p>

                <p className="mt-6 max-w-xs text-sm leading-6 text-muted">
                  A digital food redistribution network built to
                  move surplus toward people and communities that
                  need it.
                </p>
              </div>

              <div className="mt-16 hidden lg:block">
                <p className="text-[10px] uppercase tracking-[0.08em] text-ash">
                  FoodBridge / 001
                </p>
              </div>
            </div>
          </div>


          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20"
          >
            <h1 className="max-w-6xl text-[clamp(4rem,9vw,9rem)] font-normal leading-[0.84] tracking-[-0.065em]">
              SURPLUS
              <br />
              SHOULD
              <br />
              <span className="text-green">MOVE.</span>
            </h1>

            <div className="mt-12 grid gap-8 border-t border-line pt-7 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
                FoodBridge AI connects surplus food from businesses
                and individuals with verified communities that need
                it — helping reduce waste while creating measurable
                social impact.
              </p>

              <span className="fb-label text-ash">
                01 — The idea
              </span>
            </div>
          </motion.div>
        </div>
      </section>


      {/* =====================================================
          MISSION / VISION
      ===================================================== */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="border-b border-line px-6 py-14 md:px-10 md:py-16 lg:border-b-0 lg:border-r lg:px-12 lg:py-20"
          >
            <div className="flex items-center justify-between">
              <p className="fb-label text-green">
                02 — Our mission
              </p>

              <HeartHandshake
                size={20}
                strokeWidth={1.2}
                className="text-green"
              />
            </div>

            <h2 className="mt-14 max-w-xl text-[clamp(2.75rem,5vw,5rem)] font-normal leading-[0.92] tracking-[-0.05em]">
              FOOD SHOULD REACH PEOPLE,
              <br />
              <span className="text-green">NOT LANDFILLS.</span>
            </h2>

            <div className="mt-10 max-w-xl space-y-5 text-base leading-7 text-muted">
              <p>
                Every day, perfectly usable food can become surplus
                while families and communities face food insecurity.
                FoodBridge creates a bridge between these two
                realities.
              </p>

              <p>
                By bringing donors, recipient organisations and
                volunteers together on one platform, redistribution
                becomes easier to coordinate, easier to track and
                more transparent.
              </p>
            </div>
          </motion.div>


          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="bg-deep-green px-6 py-14 text-white md:px-10 md:py-16 lg:px-12 lg:py-20"
          >
            <div className="flex items-center justify-between">
              <p className="fb-label text-light-green">
                03 — Our vision
              </p>

              <Target
                size={20}
                strokeWidth={1.2}
                className="text-light-green"
              />
            </div>

            <h2 className="mt-14 max-w-xl text-[clamp(2.75rem,5vw,5rem)] font-normal leading-[0.92] tracking-[-0.05em]">
              A WORLD WHERE
              <br />
              SURPLUS BECOMES
              <br />
              <span className="text-light-green">OPPORTUNITY.</span>
            </h2>

            <p className="mt-10 max-w-xl text-base leading-7 text-white/55">
              We envision communities where businesses,
              individuals, organisations and volunteers can work
              together to redirect excess food toward people who
              need it.
            </p>

            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="flex items-start gap-4">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.2}
                  className="mt-0.5 shrink-0 text-light-green"
                />

                <p className="max-w-md text-sm leading-6 text-white/65">
                  Built around trust, coordination and measurable
                  impact.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* =====================================================
          THE NETWORK
      ===================================================== */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px]">

          <div className="grid lg:grid-cols-[0.75fr_1.25fr]">

            {/* Intro */}
            <div className="border-b border-line px-6 py-12 md:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-16">
              <p className="fb-label text-green">
                04 — The network
              </p>

              <h2 className="mt-8 max-w-md text-[clamp(3rem,5vw,5rem)] font-normal leading-[0.9] tracking-[-0.05em]">
                ONE NETWORK.
                <br />
                <span className="text-green">
                  MANY HANDS.
                </span>
              </h2>

              <p className="mt-8 max-w-sm text-base leading-7 text-muted">
                FoodBridge coordinates the people and organisations
                needed to move surplus food from donation to
                delivery.
              </p>
            </div>


            {/* Roles */}
            <div>
              {/* Donors */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55 }}
                className="grid border-b border-line md:grid-cols-[120px_1fr] lg:grid-cols-[150px_1fr]"
              >
                <div className="border-b border-line px-6 py-7 md:border-b-0 md:border-r md:px-8 lg:px-10">
                  <Leaf
                    size={20}
                    strokeWidth={1.2}
                    className="text-green"
                  />
                </div>

                <div className="px-6 py-7 md:px-8 lg:px-10">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-normal tracking-[-0.03em] md:text-3xl">
                      Donors
                    </h3>

                    <span className="fb-label text-ash">
                      01
                    </span>
                  </div>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted md:text-base md:leading-7">
                    Businesses and individuals can list surplus food
                    and make it available to communities that need
                    it.
                  </p>
                </div>
              </motion.div>


              {/* Recipients */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="grid border-b border-line md:grid-cols-[120px_1fr] lg:grid-cols-[150px_1fr]"
              >
                <div className="border-b border-line px-6 py-7 md:border-b-0 md:border-r md:px-8 lg:px-10">
                  <Users
                    size={20}
                    strokeWidth={1.2}
                    className="text-green"
                  />
                </div>

                <div className="px-6 py-7 md:px-8 lg:px-10">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-normal tracking-[-0.03em] md:text-3xl">
                      Recipients
                    </h3>

                    <span className="fb-label text-ash">
                      02
                    </span>
                  </div>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted md:text-base md:leading-7">
                    Verified organisations can discover available
                    food and connect with donations based on their
                    needs.
                  </p>
                </div>
              </motion.div>


              {/* Volunteers */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="grid md:grid-cols-[120px_1fr] lg:grid-cols-[150px_1fr]"
              >
                <div className="border-b border-line px-6 py-7 md:border-b-0 md:border-r md:px-8 lg:px-10">
                  <HeartHandshake
                    size={20}
                    strokeWidth={1.2}
                    className="text-green"
                  />
                </div>

                <div className="px-6 py-7 md:px-8 lg:px-10">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-normal tracking-[-0.03em] md:text-3xl">
                      Volunteers
                    </h3>

                    <span className="fb-label text-ash">
                      03
                    </span>
                  </div>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted md:text-base md:leading-7">
                    Volunteers help move accepted donations from
                    pickup points to the communities receiving them.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          INTELLIGENCE
      ===================================================== */}
      <section className="border-b border-line bg-[#F0F1EC]">
        <div className="mx-auto max-w-[1400px]">

          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">

            {/* Main */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65 }}
              className="border-b border-line px-6 py-14 md:px-10 md:py-16 lg:border-b-0 lg:border-r lg:px-12 lg:py-20"
            >
              <div className="flex items-center gap-3">
                <Sparkles
                  size={19}
                  strokeWidth={1.2}
                  className="text-green"
                />

                <p className="fb-label text-green">
                  05 — Intelligent coordination
                </p>
              </div>

              <h2 className="mt-10 max-w-3xl text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                TECHNOLOGY
                <br />
                THAT HELPS
                <br />
                FOOD <span className="text-green">MOVE.</span>
              </h2>

              <p className="mt-10 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
                FoodBridge AI uses intelligent matching and
                prioritisation to help connect available food with
                recipient needs while considering factors such as
                food type, quantity, urgency and location.
              </p>
            </motion.div>


            {/* Features */}
            <div className="bg-paper">

              <div className="border-b border-line px-6 py-8 md:px-10 lg:px-12">
                <p className="fb-label text-ash">
                  What the system considers
                </p>
              </div>

              <div className="grid">

                <div className="border-b border-line px-6 py-8 md:px-10 lg:px-12">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xl font-normal tracking-[-0.02em]">
                        Smart matching
                      </p>

                      <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                        Connect donations with relevant recipient
                        needs.
                      </p>
                    </div>

                    <span className="fb-label text-ash">
                      01
                    </span>
                  </div>
                </div>


                <div className="border-b border-line px-6 py-8 md:px-10 lg:px-12">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xl font-normal tracking-[-0.02em]">
                        Freshness awareness
                      </p>

                      <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                        Help prioritise food using time-sensitive
                        information.
                      </p>
                    </div>

                    <span className="fb-label text-ash">
                      02
                    </span>
                  </div>
                </div>


                <div className="px-6 py-8 md:px-10 lg:px-12">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xl font-normal tracking-[-0.02em]">
                        Impact intelligence
                      </p>

                      <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                        Track meals rescued and people supported.
                      </p>
                    </div>

                    <span className="fb-label text-ash">
                      03
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          CLOSING STATEMENT
      ===================================================== */}
      <section className="border-b border-line bg-deep-green text-white">
        <div className="mx-auto max-w-[1400px]">

          <div className="px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">

            <p className="fb-label text-light-green">
              06 — Why it matters
            </p>

            <h2 className="mt-10 max-w-6xl text-[clamp(3.5rem,8vw,8rem)] font-normal leading-[0.86] tracking-[-0.06em]">
              LESS WASTE.
              <br />
              MORE
              <br />
              <span className="text-light-green">
                POSSIBILITY.
              </span>
            </h2>

            <div className="mt-12 flex flex-col justify-between gap-8 border-t border-white/10 pt-7 md:flex-row md:items-end">
              <p className="max-w-xl text-base leading-7 text-white/55 md:text-lg md:leading-8">
                FoodBridge exists to make the movement of surplus
                food simpler, more coordinated and more meaningful.
              </p>

              <span className="text-[10px] uppercase tracking-[0.08em] text-white/30">
                Surplus → Connection → Community
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[0.8fr_1.2fr]">

          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
            <p className="fb-label text-green">
              07 — Take part
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20"
          >
            <h2 className="max-w-4xl text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.88] tracking-[-0.055em]">
              READY TO
              <br />
              <span className="text-green">
                MOVE FOOD?
              </span>
            </h2>

            <p className="mt-8 max-w-xl text-base leading-7 text-muted md:text-lg md:leading-8">
              Join the FoodBridge community and become part of a
              connected food rescue ecosystem.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                to="/register"
                className="group inline-flex items-center justify-between gap-10 border border-deep-green bg-deep-green px-5 py-4 text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-green"
              >
                Create an account

                <ArrowRight
                  size={16}
                  strokeWidth={1.2}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="group inline-flex items-center justify-between gap-10 border border-line px-5 py-4 text-[11px] uppercase tracking-[0.08em] text-ink transition-colors hover:border-deep-green hover:text-green"
              >
                Login

                <ArrowRight
                  size={16}
                  strokeWidth={1.2}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

            </div>
          </motion.div>
        </div>
      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">

          <div>
            <p className="text-sm font-medium">
              FoodBridge AI
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-ash">
              Turning surplus into hope.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-[0.08em] text-ash">
              © {new Date().getFullYear()}
            </span>

            <Link
              to="/"
              className="fb-arrow text-[10px] uppercase tracking-[0.08em] text-muted hover:text-green"
            >
              Back to FoodBridge
              <ArrowRight
                size={14}
                strokeWidth={1.2}
              />
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default About;