import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Shield } from "lucide-react"
import { useNavigate } from "react-router"

const LandingPage = () => {

    const navigate = useNavigate();

    return (
        <section className="relative py-20 lg:py-32 bg-background h-screen">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                            <Shield className="h-4 w-4" />
                            <span>Trusted by 50,000+ users</span>
                        </div>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                        Sign Documents Securely with Your <span className="text-primary">Aadhaar Card</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                        Experience the fastest, most secure way to sign important documents using your Aadhaar authentication.
                        Legally valid, instantly verified, and completely secure.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3" onClick={() => navigate("/settings")}>
                            Sign Your Document Now
                        </Button>
                        <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                            Watch Demo
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span>Legally Valid</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>Instant Verification</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span>Bank-Grade Security</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LandingPage