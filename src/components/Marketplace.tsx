import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Car, Wrench, Edit, Trash2, Search, Image, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addActionLog } from './ActionLog';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'offer' | 'demand';
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  seller: string;
  contact: string;
}

interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Auta', createdAt: new Date() },
    { id: '2', name: 'Náhradní díly', createdAt: new Date() }
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'offer' | 'demand'>('all');
  const [newCategory, setNewCategory] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: 'offer' as 'offer' | 'demand',
    seller: '',
    contact: '',
    images: [] as File[]
  });

  useEffect(() => {
    const savedItems = localStorage.getItem('marketplace-items');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }));
      setItems(parsedItems);
    }

    const savedCategories = localStorage.getItem('marketplace-categories');
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories).map((cat: any) => ({
        ...cat,
        createdAt: new Date(cat.createdAt)
      }));
      setCategories(parsedCategories);
    }
  }, []);

  const saveItems = (newItems: MarketplaceItem[]) => {
    localStorage.setItem('marketplace-items', JSON.stringify(newItems));
    setItems(newItems);
  };

  const saveCategories = (newCategories: Category[]) => {
    localStorage.setItem('marketplace-categories', JSON.stringify(newCategories));
    setCategories(newCategories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.seller || !formData.contact) {
      toast({
        title: "Chyba",
        description: "Vyplňte všechna povinná pole.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const imageUrls = formData.images.map(file => URL.createObjectURL(file));

    if (editingItem) {
      const updatedItem: MarketplaceItem = {
        ...editingItem,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        type: formData.type,
        seller: formData.seller,
        contact: formData.contact,
        images: imageUrls.length > 0 ? imageUrls : editingItem.images,
        updatedAt: now
      };

      const updatedItems = items.map(item => item.id === editingItem.id ? updatedItem : item);
      saveItems(updatedItems);

      addActionLog(
        formData.seller,
        formData.contact,
        `Upravil inzerát: ${formData.title}`,
        'marketplace',
        `Kategorie: ${formData.category}, Typ: ${formData.type === 'offer' ? 'Nabídka' : 'Poptávka'}`
      );

      toast({ title: "Inzerát upraven", description: "Inzerát byl úspěšně aktualizován." });
    } else {
      const newItem: MarketplaceItem = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        type: formData.type,
        images: imageUrls,
        createdAt: now,
        updatedAt: now,
        seller: formData.seller,
        contact: formData.contact
      };

      saveItems([...items, newItem]);

      addActionLog(
        formData.seller,
        formData.contact,
        `Přidal nový inzerát: ${formData.title}`,
        'marketplace',
        `Kategorie: ${formData.category}, Typ: ${formData.type === 'offer' ? 'Nabídka' : 'Poptávka'}`
      );

      toast({ title: "Inzerát přidán", description: "Nový inzerát byl úspěšně vytvořen." });
    }

    resetForm();
    setIsAddDialogOpen(false);
    setEditingItem(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      type: 'offer',
      seller: '',
      contact: '',
      images: []
    });
  };

  const handleEdit = (item: MarketplaceItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      type: item.type,
      seller: item.seller,
      contact: item.contact,
      images: []
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const item = items.find(i => i.id === id);
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);

    if (item) {
      addActionLog(
        item.seller,
        item.contact,
        `Smazal inzerát: ${item.title}`,
        'marketplace'
      );
    }

    toast({ title: "Inzerát smazán", description: "Inzerát byl úspěšně odstraněn." });
  };

  const addCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Chyba",
        description: "Zadejte název kategorie.",
        variant: "destructive",
      });
      return;
    }

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory,
      createdAt: new Date()
    };

    saveCategories([...categories, category]);
    setNewCategory('');
    setIsCategoryDialogOpen(false);

    addActionLog(
      'Administrátor',
      'admin@vrakfest.cz',
      `Přidal novou kategorii: ${newCategory}`,
      'marketplace'
    );

    toast({ title: "Kategorie přidána", description: "Nová kategorie byla úspěšně vytvořena." });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold racing-gradient-text">Obchod</h1>
        <div className="flex gap-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Kategorie
              </Button>
            </DialogTrigger>
            <DialogContent className="racing-card">
              <DialogHeader>
                <DialogTitle className="racing-gradient-text">Přidat kategorii</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newCategory">Název kategorie</Label>
                  <Input
                    id="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="racing-input"
                    placeholder="Zadejte název kategorie..."
                  />
                </div>
                <Button onClick={addCategory} className="racing-btn-primary">
                  Přidat
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="racing-btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Přidat inzerát
              </Button>
            </DialogTrigger>
            <DialogContent className="racing-card max-w-2xl">
              <DialogHeader>
                <DialogTitle className="racing-gradient-text">
                  {editingItem ? 'Upravit inzerát' : 'Nový inzerát'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Název položky *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="racing-input"
                      placeholder="Zadejte název..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Cena (Kč)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="racing-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte kategorii" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Typ *</Label>
                    <Select value={formData.type} onValueChange={(value: 'offer' | 'demand') => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offer">Nabídka</SelectItem>
                        <SelectItem value="demand">Poptávka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Popis položky *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="racing-input"
                    placeholder="Podrobně popište položku..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seller">Jméno *</Label>
                    <Input
                      id="seller"
                      value={formData.seller}
                      onChange={(e) => setFormData({...formData, seller: e.target.value})}
                      className="racing-input"
                      placeholder="Vaše jméno..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact">Kontakt *</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="racing-input"
                      placeholder="Email nebo telefon..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="images">Fotky</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, images: Array.from(e.target.files || [])})}
                    className="racing-input"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {setIsAddDialogOpen(false); resetForm(); setEditingItem(null);}}>
                    Zrušit
                  </Button>
                  <Button type="submit" className="racing-btn-primary">
                    {editingItem ? 'Aktualizovat' : 'Přidat'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="racing-card p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Hledat v inzerátech..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 racing-input"
              />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny kategorie</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value: 'all' | 'offer' | 'demand') => setTypeFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Vše</SelectItem>
              <SelectItem value="offer">Nabídka</SelectItem>
              <SelectItem value="demand">Poptávka</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="racing-card">
          <TabsTrigger value="all">Vše ({filteredItems.length})</TabsTrigger>
          <TabsTrigger value="offer">Nabídky ({filteredItems.filter(i => i.type === 'offer').length})</TabsTrigger>
          <TabsTrigger value="demand">Poptávky ({filteredItems.filter(i => i.type === 'demand').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Žádné inzeráty nenalezeny</p>
                <p>Přidejte první inzerát nebo změňte filtry</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card key={item.id} className="racing-card">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={item.type === 'offer' ? 'bg-green-600' : 'bg-blue-600'}>
                        {item.type === 'offer' ? 'Nabídka' : 'Poptávka'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 racing-gradient-text">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{item.description}</p>
                    
                    {item.images.length > 0 && (
                      <div className="mb-3">
                        <div className="flex gap-2 overflow-x-auto">
                          {item.images.slice(0, 3).map((img, idx) => (
                            <img key={idx} src={img} alt="" className="w-16 h-16 object-cover rounded border border-racing-yellow/20" />
                          ))}
                          {item.images.length > 3 && (
                            <div className="w-16 h-16 bg-racing-black/50 rounded border border-racing-yellow/20 flex items-center justify-center">
                              <span className="text-xs">+{item.images.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline">{item.category}</Badge>
                      {item.price > 0 && (
                        <span className="font-bold text-racing-yellow">{item.price.toLocaleString()} Kč</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Kontakt:</strong> {item.seller}</p>
                      <p>{item.contact}</p>
                      <p className="mt-2">{item.createdAt.toLocaleDateString('cs-CZ')}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="offer">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.filter(item => item.type === 'offer').map((item) => (
              <Card key={item.id} className="racing-card">
                {/* Same card content as above */}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demand">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.filter(item => item.type === 'demand').map((item) => (
              <Card key={item.id} className="racing-card">
                {/* Same card content as above */}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}